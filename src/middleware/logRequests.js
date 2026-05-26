const COLOR = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

const colorStatus = (status) => {
  if (status >= 500) return COLOR.red;
  if (status >= 400) return COLOR.yellow;
  if (status >= 300) return COLOR.cyan;
  return COLOR.green;
};

const logRequests = (req, res, next) => {
  const inicio = Date.now();

  console.log(
    `${COLOR.gray}[${new Date().toISOString()}]${COLOR.reset} ${COLOR.magenta}→ REQ${COLOR.reset} ${COLOR.cyan}${req.method}${COLOR.reset} ${req.originalUrl}`
  );

  res.on("finish", () => {
    const ms = Date.now() - inicio;
    const color = colorStatus(res.statusCode);
    console.log(
      `${COLOR.gray}[${new Date().toISOString()}]${COLOR.reset} ${color}← RES${COLOR.reset} ${color}${res.statusCode}${COLOR.reset} ${req.method} ${req.originalUrl} ${COLOR.gray}(${ms}ms)${COLOR.reset}`
    );
  });

  next();
};

module.exports = logRequests;
