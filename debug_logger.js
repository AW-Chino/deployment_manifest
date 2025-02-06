window.debugLogger = {
    logs: [],
    log: function (message, data = null) {
        let logEntry = {
            timestamp: new Date().toISOString(),
            message: message,
            data: data
        };
        this.logs.push(logEntry);
        console.log(`[DEBUG] ${message}`, data);
    },
    exportLogs: function () {
        let blob = new Blob([JSON.stringify(this.logs, null, 2)], { type: "application/json" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "debug_logs.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Example Usage:
document.addEventListener("DOMContentLoaded", function () {
    debugLogger.log("Application loaded");
});
