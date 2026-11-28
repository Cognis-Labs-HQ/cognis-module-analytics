function toDateString(value) {
    if (!value) return null;
    const timestamp = Date.parse(String(value));
    if (Number.isNaN(timestamp)) return null;
    return new Date(timestamp).toISOString().slice(0, 10);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

async function readAccountFacts(accountStore) {
    return Promise.all(
        (await accountStore.list()).map(async (account) => ({
            ...account,
            ...(await accountStore.getInfo(account.username)),
        })),
    );
}

export async function computeMetrics(accountStore, days) {
    const rows = await readAccountFacts(accountStore);
    const now = Date.now();
    const cutoffDays = now - days * MS_PER_DAY;
    const cutoff7d = now - 7 * MS_PER_DAY;

    let activeUsers7d = 0;
    let newUsersDays = 0;
    let enabledUsers = 0;
    let dormantUsers30d = 0;
    const roleBreakdown = {};

    for (const row of rows) {
        const role = String(row.role ?? "user");
        roleBreakdown[role] = (roleBreakdown[role] ?? 0) + 1;

        if (row.enabled !== 0 && row.enabled !== false) enabledUsers++;

        if (row.lastLogin) {
            const loginMs = Date.parse(String(row.lastLogin));
            if (Number.isFinite(loginMs) && loginMs >= cutoff7d) {
                activeUsers7d++;
            }
            if (Number.isFinite(loginMs) && loginMs < now - 30 * MS_PER_DAY) {
                dormantUsers30d++;
            }
        } else {
            dormantUsers30d++;
        }

        if (row.createdAt) {
            const createdMs = Date.parse(String(row.createdAt));
            if (Number.isFinite(createdMs) && createdMs >= cutoffDays) {
                newUsersDays++;
            }
        }
    }

    return {
        totalUsers: rows.length,
        activeUsers7d,
        newUsersDays,
        enabledUsers,
        disabledUsers: rows.length - enabledUsers,
        dormantUsers30d,
        activationRate:
            rows.length > 0
                ? Math.round((activeUsers7d / rows.length) * 1000) / 10
                : 0,
        days,
        roleBreakdown,
    };
}

export async function computeSeries(accountStore, days) {
    const rows = await readAccountFacts(accountStore);
    const cutoff = Date.now() - days * MS_PER_DAY;
    const countByDate = {};

    for (const row of rows) {
        if (Date.parse(row.createdAt) < cutoff) continue;
        const date = toDateString(row.createdAt);
        if (!date) continue;
        countByDate[date] = (countByDate[date] ?? 0) + 1;
    }

    const series = [];
    for (let offset = days - 1; offset >= 0; offset--) {
        const date = new Date(Date.now() - offset * MS_PER_DAY)
            .toISOString()
            .slice(0, 10);
        series.push({ date, count: countByDate[date] ?? 0 });
    }

    return series;
}
