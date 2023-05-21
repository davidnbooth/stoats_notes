// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
    apps: [
        {
            name: "server",
            script: "server.mjs",
            instances: 2,
            exec_mode: "cluster",
            autorestart: true,
            watch: true,
            merge_logs: true,
            out_file:  "./pm2_out.log",
            error_file:  "./pm2_err.log",
            log_date_format: "ddd, MMMM D YYYY, HH:mm:ss Z"
        }
    ]
}
