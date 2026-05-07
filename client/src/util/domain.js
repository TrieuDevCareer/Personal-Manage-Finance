export default process.env.NODE_ENV === "development"
  ? `http://${window.location.hostname}:5000`
  : process.env.NODE_ENV === "production" && "/api";
