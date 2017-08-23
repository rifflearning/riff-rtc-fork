
export default function log() {
  if (process.env.DEBUG) {
    console.log.apply(console, arguments);
  }
};
