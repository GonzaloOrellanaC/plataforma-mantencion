import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel, IonToast } from '@ionic/react';
import { uploadPhoto } from '../services/uploadService';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [companyId, setCompanyId] = useState('company-test');
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
  };

  const onUpload = async () => {
    if (!file) return setErr('Selecciona un archivo');
    setBusy(true);
    setErr(null);
    try {
      const token = localStorage.getItem('token') || undefined;
      const res = await uploadPhoto(file, companyId, token || undefined);
      setResult(res.url);
    } catch (e: any) {
      setErr(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Upload Photo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Company ID</IonLabel>
          <IonInput value={companyId} onIonChange={e => setCompanyId(String((e.target as any).value))} />
        </IonItem>

        <div style={{ marginTop: 16 }}>
          <input type="file" accept="image/*" onChange={onFileChange} />
        </div>

        <div style={{ marginTop: 16 }}>
          <IonButton onClick={onUpload} disabled={busy}>Upload</IonButton>
        </div>

        {result && (
          <div style={{ marginTop: 16 }}>
            <strong>Uploaded:</strong>
            <div><a href={result} target="_blank" rel="noreferrer">{result}</a></div>
          </div>
        )}

        <IonToast isOpen={!!err} message={err || ''} onDidDismiss={() => setErr(null)} duration={3000} />
      </IonContent>
    </IonPage>
  );
};

export default UploadPage;
