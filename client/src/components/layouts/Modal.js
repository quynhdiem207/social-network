import React, { memo } from 'react';
import styles from "../scss/Modal.module.scss";

const Modal = ({ title, massage, onCancel, onOK }) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modalBackdrop}></div>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <div className="lead">{title}</div>
                </div>
                <div className="mb-2 mt-2">
                    <p>{massage}</p>
                </div>
                <div className={styles.modalFooter}>
                    <button
                        className="btn btn-light"
                        onClick={onCancel}
                    >
                        No
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={onOK}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default memo(Modal);
