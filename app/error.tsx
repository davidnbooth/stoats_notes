'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import styles from './not-found.module.scss'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div id={styles["container"]}>
      <div id={styles["text"]}>
          <h2>5xx | Unexpected Error</h2>
          <p>Sorry fam.  Best return to the homepage and try again 🤷</p>
          <p><a href="/" id={styles["home-link"]}>Return to Home</a></p>
      </div>
    </div>
  )
}