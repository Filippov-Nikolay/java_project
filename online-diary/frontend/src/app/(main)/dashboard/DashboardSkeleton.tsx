import { Skeleton } from "@shared/ui/Skeleton";
import { SkeletonCard } from "@shared/ui/SkeletonCard";
import styles from "./styles.module.scss";

export const DashboardSkeleton = () => {
  return (
    <div className={styles.page}>
      <div className={styles.grid}>

        <div className={styles.colLeft}>
          <SkeletonCard>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <Skeleton width={52} height={43} borderRadius="50%" />
              <div>
                <Skeleton width={120} height={20} />
                <Skeleton width={80} height={14} style={{ marginTop: '8px' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[1, 2, 3].map(i => <Skeleton key={i} height={60} borderRadius="12px" />)}
            </div>
          </SkeletonCard>

          <SkeletonCard>
            <Skeleton width={150} height={20} style={{ marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} height={50} borderRadius="12px" />)}
            </div>
          </SkeletonCard>

          <SkeletonCard>
            <Skeleton width={130} height={20} style={{ marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '16px', overflow: 'hidden' }}>
              {[1, 2, 3].map(i => (
                <Skeleton key={i} width={260} height={180} borderRadius="18px" style={{ flexShrink: 0 }} />
              ))}
            </div>
          </SkeletonCard>
        </div>

        <div className={styles.colCenter}>
          <SkeletonCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <Skeleton width={100} height={25} />
              <Skeleton width={120} height={24} borderRadius="20px" />
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Skeleton width={180} height={180} borderRadius="50%" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2, 3, 4].map(i => <Skeleton key={i} height={8} borderRadius="4px" />)}
              </div>
            </div>
          </SkeletonCard>

          <SkeletonCard>
            <Skeleton width={180} height={20} style={{ marginBottom: '20px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Skeleton width={32} height={32} borderRadius="8px" />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="80%" height={14} />
                    <Skeleton width="40%" height={10} style={{ marginTop: '6px' }} />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        <div className={styles.colRight}>
          <SkeletonCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <Skeleton width={120} height={20} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <Skeleton width={24} height={24} borderRadius="50%" />
                <Skeleton width={24} height={24} borderRadius="50%" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '20px' }}>
              {[...Array(35)].map((_, i) => <Skeleton key={i} height={30} borderRadius="6px" />)}
            </div>
            <Skeleton width="100%" height={1} style={{ marginBottom: '20px' }} />
            <Skeleton width={140} height={18} style={{ marginBottom: '12px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Skeleton height={45} borderRadius="12px" />
              <Skeleton height={45} borderRadius="12px" />
            </div>
          </SkeletonCard>
        </div>

      </div>
    </div>
  );
};