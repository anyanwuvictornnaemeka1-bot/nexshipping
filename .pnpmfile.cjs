function readPackage(pkg) {
  if (pkg.name === "express" && pkg.dependencies) {
    if (pkg.dependencies["path-to-regexp"] === "0.1.12") {
      pkg.dependencies["path-to-regexp"] = "0.1.13";
    }
    if (pkg.dependencies["body-parser"] === "1.20.3") {
      pkg.dependencies["body-parser"] = "1.20.6";
    }
    if (pkg.dependencies.qs === "6.13.0") {
      pkg.dependencies.qs = "6.16.0";
    }
  }

  if (pkg.name === "body-parser" && pkg.dependencies?.qs === "~6.15.1") {
    pkg.dependencies.qs = "6.16.0";
  }

  return pkg;
}

module.exports = { hooks: { readPackage } };
