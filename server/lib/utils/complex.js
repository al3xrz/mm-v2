function violationsFixations(complex) {

    if (complex.items.find(item => item.key_ === 'fixations')) {
        const fixations = complex.items.filter(item => item.key_ === "fixations").length > 0 ? complex.items.filter(item => item.key_ === "fixations")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "violations").length > 0 ? complex.items.filter(item => item.key_ === "violations")[0].lastvalue : 0;
        return { violations, fixations };
    }


    if (complex.items.find(item => item.key_ === 'total-fixations-krechet-mysql.sh[{HOST.IP}, {$MYSQL_LOGIN}, {$MYSQL_PASSWORD}]')) {
        const fixations = complex.items.filter(item => item.key_ === "total-fixations-krechet-mysql.sh[{HOST.IP}, {$MYSQL_LOGIN}, {$MYSQL_PASSWORD}]").length > 0 ? complex.items.filter(item => item.key_ === "total-fixations-krechet-mysql.sh[{HOST.IP}, {$MYSQL_LOGIN}, {$MYSQL_PASSWORD}]")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "total-violations-krechet-mysql.sh[{HOST.IP}, {$MYSQL_LOGIN}, {$MYSQL_PASSWORD}]").length > 0 ? complex.items.filter(item => item.key_ === "total-violations-krechet-mysql.sh[{HOST.IP}, {$MYSQL_LOGIN}, {$MYSQL_PASSWORD}]")[0].lastvalue : 0;
        return { violations, fixations };
    }


    if (complex.items.find(item => item.key_ === 'mssFixation')) {
        const fixations = complex.items.filter(item => item.key_ === "mssFixation").length > 0 ? complex.items.filter(item => item.key_ === "mssFixation")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "mssViolation").length > 0 ? complex.items.filter(item => item.key_ === "mssViolation")[0].lastvalue : 0;
        return { violations, fixations };
    }


    if (complex.items.find(item => item.key_ === 'todays_fixations')) {
        const fixations = complex.items.filter(item => item.key_ === "todays_fixations").length > 0 ? complex.items.filter(item => item.key_ === "todays_fixations")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "todays_violations").length > 0 ? complex.items.filter(item => item.key_ === "todays_violations")[0].lastvalue : 0;
        return { violations, fixations };
    }

    if (complex.items.find(item => item.key_ === 'count_cars')) {
        const fixations = complex.items.filter(item => item.key_ === "count_cars").length > 0 ? complex.items.filter(item => item.key_ === "count_cars")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "todays_violation").length > 0 ? complex.items.filter(item => item.key_ === "todays_violation")[0].lastvalue : 0;
        return { violations, fixations };
    }

    if (complex.items.find(item => item.key_ === 'mssFixation')) {
        const fixations = complex.items.filter(item => item.key_ === "mssFixation").length > 0 ? complex.items.filter(item => item.key_ === "mssFixation")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "mssViolation").length > 0 ? complex.items.filter(item => item.key_ === "mssViolation")[0].lastvalue : 0;
        return { violations, fixations };
    }

    const fixations = complex.items.filter(item => item.key_ === "Ptolemey.todays_passages").length > 0 ? complex.items.filter(item => item.key_ === "Ptolemey.todays_passages")[0].lastvalue : 0;
    const violations = complex.items.filter(item => item.key_ === "Ptolemey.todays_violations").length > 0 ? complex.items.filter(item => item.key_ === "Ptolemey.todays_violations")[0].lastvalue : 0;


    return { violations, fixations };
}


module.exports = {
    violationsFixations,
}

