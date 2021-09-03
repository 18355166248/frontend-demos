import pathMatch from "path-match";

export default function createRouter(routes) {
  const matchers = Object.keys(routes).map((path) => [
    pathMatch()(path),
    routes[path],
  ]);

  return function (path) {
    return matchers.some(([matcher, f]) => {
      const res = matcher(path);
      if (res === false) return false;
      f(res);
      return true;
    });
  };
}
