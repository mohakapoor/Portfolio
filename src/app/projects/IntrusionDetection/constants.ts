export const MODEL_METADATA = {
    logreg: {
        title: "Logistic Regression",
        shortTitle: "LogReg",
        tag: "BASELINE",
        accuracy: "~93%",
        description: "Baseline performance using Logistic Regression. Shows stable detection for simple attack vectors but struggles with high-dimensional variance in complex multiclases.",
        border: "border-yellow-500",
        text: "text-yellow-500"
    },
    svm: {
        title: "SVM",
        shortTitle: "SVM",
        tag: "BEST BINARY",
        accuracy: "96.7%",
        description: "Superior margin-based separation for binary (Attack vs. Benign) classification. Maintains high precision in identifying the threat boundary.",
        border: "border-blue-500",
        text: "text-blue-400"
    },
    lightgbm: {
        title: "LightGBM",
        shortTitle: "LightGBM",
        tag: "BEST MULTICLASS",
        accuracy: "~99%",
        description: "State-of-the-art leaf-wise gradient boosting. Achieved the highest multiclass accuracy with exceptional precision across major attack types.",
        border: "border-green-500",
        text: "text-green-400"
    },
    xgboost: {
        title: "XGBoost",
        shortTitle: "XGBoost",
        tag: "LEVEL-WISE GROWTH",
        accuracy: "~97%",
        description: "Exceptional multiclass stability using level-wise expansion and balanced sample weighting. Serves as a robust comparative baseline.",
        border: "border-orange-500",
        text: "text-orange-400"
    },
    ffnn: {
        title: "FFNN",
        shortTitle: "FFNN",
        tag: "DEEP LEARNING",
        accuracy: "~98%",
        description: "Strong baseline for neural approaches, capturing non-linear relationships across 80+ network features through deep feed-forward layers.",
        border: "border-purple-500",
        text: "text-purple-400"
    }
};

export const GALLERY_IMAGES = [
    {
        src: "/intrusion_detection_plots/logreg_test_cr.png",
        alt: "Logistic Regression Classification Report",
        title: "LogReg Results",
        description: MODEL_METADATA.logreg.description
    },
    {
        src: "/intrusion_detection_plots/svm_test_cr.png",
        alt: "SVM Classification Report",
        title: "SVM Results",
        description: MODEL_METADATA.svm.description
    },
    {
        src: "/intrusion_detection_plots/lightgbm_test_cr.png",
        alt: "LightGBM Classification Report",
        title: "LightGBM Results",
        description: MODEL_METADATA.lightgbm.description
    },
    {
        src: "/intrusion_detection_plots/ffnn_test_cr.png",
        alt: "FFNN Classification Report",
        title: "FFNN Results",
        description: MODEL_METADATA.ffnn.description
    },
    {
        src: "/intrusion_detection_plots/xgboost_test_cr.png",
        alt: "XGBoost Confusion Matrix",
        title: "XGBoost Results",
        description: MODEL_METADATA.xgboost.description
    },
    {
        src: "/intrusion_detection_plots/autoencoder_per_attack_recall.png",
        alt: "Denoising Autoencoder Per-Attack Recall",
        title: "Autoencoder Recall",
        description: "Detailed recall breakdown for the Denoising Autoencoder. Unsupervised anomaly detection focusing on reconstruction error to isolate unknown threat patterns."
    },
    {
        src: "/intrusion_detection_plots/isolation_forestper_attack_recall.png",
        alt: "Isolation Forest Per-Attack Recall",
        title: "IsoForest Recall",
        description: "Isolation Forest performance per attack type. Excels at identifying structural anomalies like PortScans (99% recall) through recursive spatial partitioning."
    },
    {
        src: "/intrusion_detection_plots/ffnn_loss_plot.png",
        alt: "FFNN Training Loss Curves",
        title: "FFNN Loss",
        description: "Training vs. Validation loss over 50 epochs. Confirms model convergence with minimal overfitting, demonstrating robust generalization on the Friday holdout test set."
    },
    {
        src: "/intrusion_detection_plots/hybrid_test_cr.png",
        alt: "Hybrid Pipeline Classification Report",
        title: "Hybrid Strategy: Classification",
        description: "End-to-end classification report for the sequential Hybrid Pipeline. Demonstrates 99%+ recall on high-severity attacks while filtering benign noise with extreme precision."
    },
    {
        src: "/intrusion_detection_plots/hybrid_test_cm.png",
        alt: "Hybrid Pipeline Confusion Matrix",
        title: "Hybrid Strategy: Confusion Matrix",
        description: "Final confusion matrix for the combined AE+IF+LGBM pipeline. Confirms negligible false positives and robust multiclass stability across all holdout Friday test samples."
    }
];
