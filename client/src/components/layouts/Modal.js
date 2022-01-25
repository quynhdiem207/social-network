import React, { memo } from 'react';
import styles from "../scss/Modal.module.scss";

const Modal = ({ title, onCancel, component: Component }) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modalBackdrop}></div>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <div className="lead">{title}</div>
                    <button
                        className="btn btn-light"
                        onClick={onCancel}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="mb-2 mt-2">
                    <Component />
                </div>
            </div>
        </div>
    )
}

export default memo(Modal);
