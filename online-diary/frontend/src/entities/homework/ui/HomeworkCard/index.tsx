"use client";

import { useState } from "react";
import clsx from "clsx";
import { IoDocumentTextOutline } from "react-icons/io5"; 
import { Homework } from "../../model/types";
import { HomeworkDetailModal } from "@features/manage-submissions/submit-homework";
import styles from "./styles.module.scss";

interface Props {
  data: Homework;
}

export const HomeworkCard = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);


  const hasCustomIcon = !!data.iconFileName;

  const isMainFileImage = !hasCustomIcon && data.fileName && 
    /\.(jpeg|jpg|gif|png|svg)$/i.test(data.fileName);


  const imageSrc = hasCustomIcon 
    ? `/api/files/download/${data.iconFileName}` 
    : `/api/files/download/${data.fileName}`;

  return (
    <>
      <div className={styles.card} onClick={() => setIsOpen(true)}>
        <div className={styles.iconBox}>
          {hasCustomIcon || isMainFileImage ? (
            <img 
              src={imageSrc} 
              alt="" 
              className={styles.subjectImage} 

              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className={styles.placeholderIcon}>
               <IoDocumentTextOutline />
            </div>
          )}
        </div>
        
        <div className={styles.info}>
          <div className={styles.headerRow}>
            <span className={styles.subjectName}>{data.subjectName}</span>
            {data.isOverdue && <span className={styles.overdueLabel}>Терміново</span>}
          </div>
          
          <h3 className={styles.title}>{data.title}</h3>
          
          <div className={styles.footer}>
            <div className={styles.dateBlock}>
               <span className={styles.label}>Задано:</span>
               <span className={styles.dateValue}>{data.date}</span>
            </div>
            
            <div className={clsx(styles.deadline, data.isOverdue && styles.overdue)}>
              {data.deadlineText}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <HomeworkDetailModal 
          task={data} 
          onClose={() => setIsOpen(false)} 
          onSuccess={() => setIsOpen(false)}
        />
      )}
    </>
  );
};