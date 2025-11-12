// src/components/ConfirmModal.jsx

import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel, visible }) => {
    if (!visible) return null;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-dialog">
                <div className="modal-header">
                    <i className="fas fa-exclamation-triangle"></i>
                    <h3>Confirm Logout</h3>
                </div>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="btn modal-cancel-btn">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn modal-confirm-btn">
                        Confirm (OK)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;