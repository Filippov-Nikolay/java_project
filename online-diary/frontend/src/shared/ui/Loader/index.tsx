import styles from "./styles.module.scss";

export const Loader = () => (
  <div className={styles.overlay}>
    <div className={styles.container}>
      <div className={styles.rings}>
        <div className={styles.ring} />
        <div className={styles.ring} />
        <div className={styles.ring} />
      </div>
      <div className={styles.content}>
        <span className={styles.logo}>OD</span>
        <div className={styles.text}>
          <span>ONLINE</span>
          <span className={styles.highlight}>DIARY</span>
        </div>
      </div>
      <div className={styles.particles}>
        <div className={styles.particle} />
        <div className={styles.particle} />
        <div className={styles.particle} />
      </div>
    </div>
  </div>
);