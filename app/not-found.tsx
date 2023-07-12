import Link from "next/link";
import styles from "./not-found.module.scss";
import Logger from "../lib/Logger"; 

export default function NotFound() {
    Logger.info(`${(new Date()).toISOString()}: 404 | Not Found`);

    return (
        <div id={styles["container"]}>
            <div id={styles["text"]}>
                <h2>404 | Not Found</h2>
                <p>Could not find the requested resource, sorry! 🤪</p>
                <p><Link href="/" id={styles["home-link"]}>Return to Home</Link></p>
            </div>
        </div>
    );
}