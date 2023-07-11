import Link from 'next/link'
import styles from './not-found.module.scss'
 
export default function NotFound() {
    return (
        <div id={styles["container"]}>
            <div id={styles["text"]}>
                <h2>404 | Not Found</h2>
                <p>Could not find the requested resource, sorry! 🤪</p>
                <p><Link href="/" id={styles["home-link"]}>Return to Home</Link></p>
            </div>
        </div>
    )
}