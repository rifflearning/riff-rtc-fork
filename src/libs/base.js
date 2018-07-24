import firebase from "firebase";

const config = window.client_config.firebase;
const app = firebase.initializeApp(config);

export default app;
