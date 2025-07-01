
import React, { useMemo, useCallback, useState, Fragment } from 'react';
import * as XLSX from 'xlsx';
import { CreditApplicationData, BilanActifKeys, BilanPassifKeys, BilanPassifValue } from '../types.ts';

interface BilanPageProps {
  formData: CreditApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
  onNext: () => void;
  isReadOnly?: boolean;
}

const FormCell = ({
  children, className = '', colSpan = 1, rowSpan = 1, align = 'start'
}: {
  children: React.ReactNode; className?: string; colSpan?: number; rowSpan?: number; align?: 'start' | 'center' | 'end';
}) => {
  const baseClasses = 'border-black p-1 text-xs flex items-center';
  const alignClass = `justify-${align}`;
  const style: React.CSSProperties = {
    gridColumn: `span ${colSpan} / span ${colSpan}`,
    gridRow: `span ${rowSpan} / span ${rowSpan}`,
  };
  return <div style={style} className={`${baseClasses} ${className} ${alignClass}`}>{children}</div>;
};

const InputField = ({
  value, onChange, type = 'text', readOnly = false, className = ''
}: {
  value: any; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; readOnly?: boolean; className?: string;
}) => (
  <input
    type={type}
    value={value ?? ''}
    onChange={onChange}
    readOnly={readOnly}
    className={`w-full h-full bg-transparent outline-none text-xs px-1 text-right ${readOnly ? 'font-semibold' : ''} ${className}`}
  />
);

interface LayoutItem {
  type?: 'header' | 'spacer';
  label: string;
  ref?: string;
  isCalc?: boolean;
  calcKey?: string;
  isTotal?: boolean;
  isSubText?: boolean;
  key?: BilanActifKeys | BilanPassifKeys;
}

const BilanPage: React.FC<BilanPageProps> = ({ formData, setFormData, onNext, isReadOnly = false }) => {
  const { bilan, compteDeResultat, bilanDateN, bilanDateN1 } = formData;
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const handleActifChange = useCallback((key: BilanActifKeys, subField: 'brut' | 'amortProv', value: string) => {
    if (isReadOnly) return;
    const numValue = parseFloat(value) || 0;
    setFormData(prev => {
        const newActif = { ...prev.bilan.actif };
        newActif[key] = { ...newActif[key], [subField]: numValue };
        return { ...prev, bilan: { ...prev.bilan, actif: newActif } };
    });
  }, [setFormData, isReadOnly]);

  const handlePassifChange = useCallback((key: BilanPassifKeys, field: 'net' | 'netN1', value: string) => {
    if (isReadOnly) return;
    const numValue = parseFloat(value) || 0;
    setFormData(prev => {
        const newPassif = { ...prev.bilan.passif };
        newPassif[key] = { ...newPassif[key], [field]: numValue };
        return { ...prev, bilan: { ...prev.bilan, passif: newPassif } };
    });
  }, [setFormData, isReadOnly]);
    
  const calculations = useMemo(() => {
    const actifNets: { [key: string]: { n: number, n1: number } } = {};
    for (const key in bilan.actif) {
        const actifKey = key as BilanActifKeys;
        const item = bilan.actif[actifKey];
        actifNets[key] = {
          n: (item?.brut ?? 0) - (item?.amortProv ?? 0),
          n1: (item?.brutN1 ?? 0) - (item?.amortProvN1 ?? 0),
        };
    }

    const v = compteDeResultat?.values;
    if (!v) {
        const zeroVal = {n: 0, n1: 0};
        return {
            actifNets: {}, AA: zeroVal, AD: zeroVal, AI: zeroVal, AQ: zeroVal, AZ: zeroVal,
            BB: zeroVal, BG: zeroVal, BK: zeroVal, BT: zeroVal, BZ: zeroVal,
            CP: zeroVal, DF: zeroVal, DG: zeroVal, DP: zeroVal, DT: zeroVal, DZ: zeroVal,
            resNetExo: zeroVal,
            ecart: 0
        };
    }

    const calcCdr = (keys: (keyof typeof v)[], signs: number[] = []) => ({
        n: keys.reduce((s, k, i) => s + (v[k]?.exerciceN || 0) * (signs[i] ?? 1), 0),
        n1: keys.reduce((s, k, i) => s + (v[k]?.exerciceN1 || 0) * (signs[i] ?? 1), 0)
    });

    const totalProduits = calcCdr(['TA', 'TC', 'TD', 'TE', 'TF', 'TH', 'TS', 'TT', 'UA', 'UC', 'UD', 'UE', 'UK', 'UL', 'UM', 'UN']);
    const totalCharges = calcCdr(['RA', 'RB', 'RC', 'RD', 'RE', 'RH', 'RI', 'RJ', 'RK', 'RL', 'RP', 'RQ', 'RS', 'SA', 'SC', 'SD', 'SK', 'SL', 'SM', 'SQ', 'SR']);
    const resNetExo = { n: totalProduits.n - totalCharges.n, n1: totalProduits.n1 - totalCharges.n1 };

    const calcActifTotal = (keys: BilanActifKeys[]) => ({
        n: keys.reduce((sum, key) => sum + (actifNets[key]?.n || 0), 0),
        n1: keys.reduce((sum, key) => sum + (actifNets[key]?.n1 || 0), 0),
    });

    const calcPassifTotal = (keys: BilanPassifKeys[], addResNet = false) => ({
        n: keys.reduce((sum, key) => sum + (bilan.passif[key]?.net || 0), 0) + (addResNet ? resNetExo.n : 0),
        n1: keys.reduce((sum, key) => sum + (bilan.passif[key]?.netN1 || 0), 0) + (addResNet ? resNetExo.n1 : 0),
    });

    const AA = calcActifTotal(['AB', 'AC']);
    const AD = calcActifTotal(['AE', 'AF', 'AG', 'AH']);
    const AI = calcActifTotal(['AJ', 'AK', 'AL', 'AM', 'AN']);
    const AQ = calcActifTotal(['AR', 'AS']);
    const AZ = { n: AA.n + AD.n + AI.n + (actifNets['AP']?.n || 0) + AQ.n, n1: AA.n1 + AD.n1 + AI.n1 + (actifNets['AP']?.n1 || 0) + AQ.n1 };
    
    const BA = calcActifTotal(['BA']);
    const BB = calcActifTotal(['BC', 'BD', 'BE', 'BF']);
    const BG = calcActifTotal(['BH', 'BI', 'BJ']);
    const BK = { n: BA.n + BB.n + BG.n, n1: BA.n1 + BB.n1 + BG.n1 };
    const BT = calcActifTotal(['BQ', 'BR', 'BS']);
    const BZ = { n: AZ.n + BK.n + BT.n + (actifNets['BU']?.n || 0), n1: AZ.n1 + BK.n1 + BT.n1 + (actifNets['BU']?.n1 || 0) };

    const CP = calcPassifTotal(['CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CK', 'CL', 'CM'], true);
    const DF = calcPassifTotal(['DA', 'DB', 'DC', 'DD', 'DE']);
    const DG = {n: CP.n + DF.n, n1: CP.n1 + DF.n1};
    const DP = calcPassifTotal(['DH', 'DI', 'DJ', 'DK', 'DL', 'DM', 'DN']);
    const DT = calcPassifTotal(['DQ', 'DR', 'DS']);
    const DZ = { n: DG.n + DP.n + DT.n + (bilan.passif['DU']?.net || 0), n1: DG.n1 + DP.n1 + DT.n1 + (bilan.passif['DU']?.netN1 || 0) };
    
    const ecart = BZ.n - DZ.n;

    return { actifNets, AA, AD, AI, AQ, AZ, BB, BG, BK, BT, BZ, CP, DF, DG, DP, DT, DZ, resNetExo, ecart };
  }, [bilan, compteDeResultat]);
    
  const actifLayout: LayoutItem[] = [
    { type: 'header', label: 'ACTIF IMMOBILISE (1)' },
    { label: 'Charges immobilisées', ref: 'AA', isCalc: true, calcKey: 'AA' },
    { label: '  Frais d\'établissement et charges à répartir', ref: 'AB', key: 'AB' },
    { label: '  Primes de remboursement des obligations', ref: 'AC', key: 'AC' },
    { label: 'Immobilisations incorporelles', ref: 'AD', isCalc: true, calcKey: 'AD' },
    { label: '  Frais de recherche et de développement', ref: 'AE', key: 'AE' },
    { label: '  Brevets, licences, logiciels', ref: 'AF', key: 'AF' },
    { label: '  Fonds commercial', ref: 'AG', key: 'AG' },
    { label: '  Autres immobilisations incorporelles', ref: 'AH', key: 'AH' },
    { label: 'Immobilisations corporelles', ref: 'AI', isCalc: true, calcKey: 'AI' },
    { label: '  Terrains', ref: 'AJ', key: 'AJ' },
    { label: '  Bâtiments', ref: 'AK', key: 'AK' },
    { label: '  Bâtiments, Installations et agencements', ref: 'AL', key: 'AL' },
    { label: '  Matériel', ref: 'AM', key: 'AM' },
    { label: '  Matériel de transport', ref: 'AN', key: 'AN' },
    { label: 'Avances et acomptes versés sur immobilisations', ref: 'AP', key: 'AP' },
    { label: 'Immobilisations financières', ref: 'AQ', isCalc: true, calcKey: 'AQ' },
    { label: '  Titres de participation', ref: 'AR', key: 'AR' },
    { label: '  Autres immobilisations financières', ref: 'AS', key: 'AS' },
    { label: '  (1) dont H.A.O', ref: 'AW', key: 'AW' },
    { type: 'spacer', label:'' },
    { label: 'TOTAL ACTIF IMMOBILISE (I)', ref: 'AZ', isCalc: true, calcKey: 'AZ', isTotal: true },
    { type: 'header', label: 'ACTIF CIRCULANT' },
    { label: 'Actif circulant H.A.O', ref: 'BA', key: 'BA' },
    { label: 'Stocks', ref: 'BB', isCalc: true, calcKey: 'BB' },
    { label: '  Marchandises', ref: 'BC', key: 'BC' },
    { label: '  Matières premières et autres approvisionnements', ref: 'BD', key: 'BD' },
    { label: '  En-cours', ref: 'BE', key: 'BE' },
    { label: '  Produits fabriqués', ref: 'BF', key: 'BF' },
    { label: 'Créances et emplois assimilés', ref: 'BG', isCalc: true, calcKey: 'BG' },
    { label: '  Fournisseurs, avances versées', ref: 'BH', key: 'BH' },
    { label: '  Clients', ref: 'BI', key: 'BI' },
    { label: '  Autres créances', ref: 'BJ', key: 'BJ' },
    { label: 'TOTAL ACTIF CIRCULANT (II)', ref: 'BK', isCalc: true, calcKey: 'BK', isTotal: true },
    { type: 'header', label: 'TRESORERIE -ACTIF' },
    { label: 'Titres de placement', ref: 'BQ', key: 'BQ' },
    { label: 'Valeurs à encaisser', ref: 'BR', key: 'BR' },
    { label: 'Banques, chèques postaux, caisse', ref: 'BS', key: 'BS' },
    { label: 'TOTAL TRESORERIE-ACTIF (III)', ref: 'BT', isCalc: true, calcKey: 'BT', isTotal: true },
    { label: 'Ecarts de conversion-Actif (IV)', ref: 'BU', key: 'BU' },
    { label: '(Perte probable de change)', isSubText: true },
    { label: 'TOTAL GENERAL (I+II+III+IV)', ref: 'BZ', isCalc: true, calcKey: 'BZ', isTotal: true }
  ];

  const passifLayout: LayoutItem[] = [
    { type: 'header', label: 'CAPITAUX PROPRES ET RESSOURCES ASSIMILEES' },
    { label: 'Capital', ref: 'CA', key: 'CA' },
    { label: 'Compte de l\'exploitant', ref: 'CB', key: 'CB' },
    { label: 'Primes et Réserves', ref: 'CC', key: 'CC' },
    { label: '  Primes d\'apport d\'émission de fusion', ref: 'CD', key: 'CD' },
    { label: '  Ecart de réevaluation', ref: 'CE', key: 'CE' },
    { label: '  Réserves indisponibles', ref: 'CF', key: 'CF' },
    { label: '  Réserves libres', ref: 'CG', key: 'CG' },
    { label: 'Report à nouveau (+ ou -)', ref: 'CH', key: 'CH' },
    { label: 'Résultat net de l\'exercice (Bénéfice+: ou Perte-)', ref: 'CI', isCalc: true, calcKey: 'resNetExo'},
    { label: 'Autres capitaux propres', ref: 'CK', key: 'CK' },
    { label: 'Subventions d\'investissement', ref: 'CL', key: 'CL' },
    { label: 'Provisions réglementées et fonds assimilés', ref: 'CM', key: 'CM' },
    { label: 'TOTAL CAPITAUX PROPRES (I)', ref: 'CP', isCalc: true, calcKey: 'CP', isTotal: true },
    { type: 'spacer', label:'' },
    { type: 'header', label: 'DETTES FINANCIERES ET RESSOURCES ASSIMILEES' },
    { label: 'Emprunts', ref: 'DA', key: 'DA' },
    { label: 'Dettes de crédit-bail et contrats assimilés', ref: 'DB', key: 'DB' },
    { label: 'Dettes financières diverses', ref: 'DC', key: 'DC' },
    { label: 'Provisions financières pour risques et charges', ref: 'DD', key: 'DD' },
    { label: '(1) dont H.A.O', ref: 'DE', key: 'DE' },
    { label: 'TOTAL DETTES FINANCIERES (II)', ref: 'DF', isCalc: true, calcKey: 'DF', isTotal: true },
    { label: 'TOTAL RESSOURCES STABLES (I+II)', ref: 'DG', isCalc: true, calcKey: 'DG', isTotal: true },
    { type: 'header', label: 'PASSIF CIRCULANT' },
    { label: 'Dettes circulantes et ressources assimilées H.A.O', ref: 'DH', key: 'DH' },
    { label: 'Clients avances reçues', ref: 'DI', key: 'DI' },
    { label: 'Fournisseurs d\'exploitation', ref: 'DJ', key: 'DJ' },
    { label: 'Dettes fiscales', ref: 'DK', key: 'DK' },
    { label: 'Dettes sociales', ref: 'DL', key: 'DL' },
    { label: 'Autres dettes (1)', ref: 'DM', key: 'DM' },
    { label: 'Risques provisionnés', ref: 'DN', key: 'DN' },
    { label: 'TOTAL PASSIF CIRCULANT (III)', ref: 'DP', isCalc: true, calcKey: 'DP', isTotal: true },
    { type: 'header', label: 'TRESORERIE -PASSIF' },
    { label: 'Banques,crédits d\'escompte', ref: 'DQ', key: 'DQ' },
    { label: 'Banques,crédits de trésorerie', ref: 'DR', key: 'DR' },
    { label: 'Banques, découverts', ref: 'DS', key: 'DS' },
    { label: 'TOTAL TRESORERIE-PASSIF (IV)', ref: 'DT', isCalc: true, calcKey: 'DT', isTotal: true },
    { label: 'Ecarts de conversion-Passif (V)', ref: 'DU', key: 'DU' },
    { label: '(Gain probable de change)', isSubText: true },
    { label: 'TOTAL GENERAL (I+II+III+IV+V)', ref: 'DZ', isCalc: true, calcKey: 'DZ', isTotal: true }
  ];

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isReadOnly) return;

    setImportStatus('loading');
    setImportMessage('Lecture du fichier...');

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, {header: 1}) as any[][];

            setImportMessage('Mise à jour du bilan...');
            
            const newBilanData = JSON.parse(JSON.stringify(formData.bilan));
            let bilanDateNSet = false;
            let bilanDateN1Set = false;

            json.forEach(row => {
                const ref = row[1]?.toString().trim().toUpperCase();
                if (!ref) return;

                if (ref in newBilanData.actif) {
                    const key = ref as BilanActifKeys;
                    newBilanData.actif[key].brut = parseFloat(row[2]) || 0;
                    newBilanData.actif[key].amortProv = parseFloat(row[3]) || 0;
                    // N-1 data for actif is often not present in standard extracts, handle gracefully
                    newBilanData.actif[key].brutN1 = parseFloat(row[5]) || 0; 
                    newBilanData.actif[key].amortProvN1 = parseFloat(row[6]) || 0;
                }
                else if (ref in newBilanData.passif) {
                    const key = ref as BilanPassifKeys;
                    newBilanData.passif[key].net = parseFloat(row[10]) || 0;
                    newBilanData.passif[key].netN1 = parseFloat(row[11]) || 0;
                }

                if (!bilanDateNSet && row[2] && row[2].toString().match(/\d{2}\/\d{2}\/\d{4}/)) {
                   setFormData(prev => ({...prev, bilanDateN: row[2]}));
                   bilanDateNSet = true;
                }
                 if (!bilanDateN1Set && row[5] && row[5].toString().match(/\d{2}\/\d{2}\/\d{4}/)) {
                   setFormData(prev => ({...prev, bilanDateN1: row[5]}));
                   bilanDateN1Set = true;
                }
            });

            setFormData(prev => ({ ...prev, bilan: newBilanData }));
            setImportStatus('success');
            setImportMessage('Bilan importé avec succès !');

        } catch (error: any) {
            console.error("Erreur d'importation Excel:", error);
            setImportStatus('error');
            setImportMessage(`Erreur lors de l'importation: ${error.message}`);
        }
    };
    reader.onerror = (error) => {
        setImportStatus('error');
        setImportMessage(`Erreur de lecture du fichier: ${error.type}`);
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };
  
  const maxRows = Math.max(actifLayout.length, passifLayout.length);
  
  const renderActifRow = (item: LayoutItem | undefined) => {
    if (!item) return <FormCell colSpan={13}>{''}</FormCell>;
    if (item.type === 'header') return <FormCell colSpan={13} className="bg-gray-200 font-bold">{item.label}</FormCell>;
    if (item.type === 'spacer') return <FormCell colSpan={13} className="!border-none h-2">{''}</FormCell>;
    
    const { label, ref, isCalc, calcKey, isTotal, isSubText, key } = item;
    const value = isCalc ? calculations[calcKey!] : (key ? bilan.actif[key as BilanActifKeys] : null);
    const netValues = isCalc ? calculations[calcKey!] : (key ? calculations.actifNets[key] : null);

    return (
        <Fragment>
            <FormCell colSpan={5} className={`bg-gray-50 ${isTotal ? 'font-bold' : ''}`}>
                {isSubText ? <span className="italic text-gray-500 ml-4">{label}</span> : label}
            </FormCell>
            <FormCell colSpan={1} align="center" className={`bg-gray-50 ${isTotal ? 'font-bold' : ''}`}>{ref || ''}</FormCell>
            
            <FormCell className="!p-0"><InputField type="number" value={value?.brut} onChange={e => handleActifChange(key as BilanActifKeys, 'brut', e.target.value)} readOnly={isReadOnly || isCalc} /></FormCell>
            <FormCell className="!p-0"><InputField type="number" value={value?.amortProv} onChange={e => handleActifChange(key as BilanActifKeys, 'amortProv', e.target.value)} readOnly={isReadOnly || isCalc}/></FormCell>
            <FormCell align="end" className="bg-gray-100 font-semibold pr-2">{netValues?.n.toLocaleString() ?? '0'}</FormCell>
            
            {/* Colonnes N-1, pour l'instant non gérées, à ajouter si besoin */}
            <FormCell colSpan={4} align="end" className="bg-gray-100 font-semibold pr-2">{netValues?.n1.toLocaleString() ?? '0'}</FormCell>
        </Fragment>
    );
  };
  
  const renderPassifRow = (item: LayoutItem | undefined) => {
      if (!item) return <FormCell colSpan={11}>{''}</FormCell>;
      if (item.type === 'header') return <FormCell colSpan={11} className="bg-gray-200 font-bold">{item.label}</FormCell>;
      if (item.type === 'spacer') return <FormCell colSpan={11} className="!border-none h-2">{''}</FormCell>;

      const { label, ref, isCalc, calcKey, isTotal, isSubText, key } = item;
      
      const renderContent = () => {
        if (isCalc && calcKey) {
            const value = calculations[calcKey as keyof typeof calculations] as { n: number; n1: number };
            return (
                <Fragment>
                    <FormCell colSpan={2} align="end" className="bg-gray-100 font-semibold pr-2">{value.n.toLocaleString()}</FormCell>
                    <FormCell colSpan={3} align="end" className="bg-gray-100 font-semibold pr-2">{value.n1.toLocaleString()}</FormCell>
                </Fragment>
            );
        }
        if (key) {
            const value = bilan.passif[key as BilanPassifKeys];
            return (
                <Fragment>
                    <FormCell colSpan={2} className="!p-0"><InputField type="number" value={value?.net} onChange={e => handlePassifChange(key as BilanPassifKeys, 'net', e.target.value)} readOnly={isReadOnly} /></FormCell>
                    <FormCell colSpan={3} className="!p-0"><InputField type="number" value={value?.netN1} onChange={e => handlePassifChange(key as BilanPassifKeys, 'netN1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                </Fragment>
            );
        }
        return <FormCell colSpan={5}>{''}</FormCell>;
      }


      return (
        <Fragment>
            <FormCell colSpan={5} className={`bg-gray-50 ${isTotal ? 'font-bold' : ''}`}>
                 {isSubText ? <span className="italic text-gray-500 ml-4">{label}</span> : label}
            </FormCell>
            <FormCell colSpan={1} align="center" className={`bg-gray-50 ${isTotal ? 'font-bold' : ''}`}>{ref}</FormCell>
            {renderContent()}
        </Fragment>
      )
  }

  return (
    <div className="bg-white p-4 rounded-lg text-sm">
        {!isReadOnly && (
            <div className="mb-6 p-4 border border-dashed border-gray-400 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Importer le Bilan depuis Excel</h3>
                <p className="text-xs text-gray-600 mb-3">Le fichier Excel doit contenir les colonnes `Ref`, `Brut N`, `Amort./Prov. N` pour l'actif, et `Ref`, `Montant N`, `Montant N-1` pour le passif.</p>
                <div className="flex items-center space-x-4">
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileImport} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" disabled={isReadOnly}/>
                    {importStatus === 'loading' && <p className="text-sm text-blue-600">{importMessage}</p>}
                    {importStatus === 'success' && <p className="text-sm text-green-600">{importMessage}</p>}
                    {importStatus === 'error' && <p className="text-sm text-red-600">{importMessage}</p>}
                </div>
            </div>
        )}
      
      <div className="mb-4 text-sm space-y-1">
          <p><span className="font-bold">Affaire:</span> {formData.affaire}</p>
          <p><span className="font-bold">Dossier:</span> {formData.dossier}</p>
          <p><span className="font-bold">Date ouverture du dossier:</span> {new Date(formData.dateOuvertureDossier).toLocaleDateString('fr-FR')}</p>
          <p className="font-bold text-red-600">En KFCFA (milliers)</p>
      </div>

      <div className="grid grid-cols-24 gap-0 border-t-2 border-black">
        {/* Header Titles */}
        <FormCell colSpan={24} className="bg-[#4F6228] text-white text-base font-bold">BILAN - SYSTÈME NORMAL</FormCell>
        <FormCell colSpan={13} className="bg-gray-200 font-bold border-r-2 border-black">ACTIF</FormCell>
        <FormCell colSpan={11} className="bg-gray-200 font-bold">PASSIF (avant répartition)</FormCell>

        {/* Column Headers */}
        <FormCell colSpan={6} className="bg-gray-200">Réf.</FormCell>
        <FormCell colSpan={3} className="bg-gray-200">Exercice N</FormCell>
        <FormCell colSpan={4} className="bg-gray-200 border-r-2 border-black">Exercice (N-1)</FormCell>
        <FormCell colSpan={6} className="bg-gray-200">Réf.</FormCell>
        <FormCell colSpan={2} className="bg-gray-200">Exercice N</FormCell>
        <FormCell colSpan={3} className="bg-gray-200">Exercice (N-1)</FormCell>
        
        {/* Sub-Column Headers */}
        <FormCell colSpan={6}>{''}</FormCell>
        <FormCell>Brut</FormCell>
        <FormCell>Amort/Prov</FormCell>
        <FormCell>Net</FormCell>
        <FormCell colSpan={4} className="border-r-2 border-black">Net</FormCell>
        <FormCell colSpan={6}>{''}</FormCell>
        <FormCell colSpan={2}>Net</FormCell>
        <FormCell colSpan={3}>Net</FormCell>

        {/* Bilan Body */}
        {Array.from({ length: maxRows }).map((_, i) => {
            const actifItem = actifLayout[i];
            const passifItem = passifLayout[i];
            return (
                <div key={i} className="contents">
                    {renderActifRow(actifItem)}
                    {renderPassifRow(passifItem)}
                </div>
            )
        })}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm font-bold">
            Écart Actif - Passif : 
            <span className={`ml-2 px-2 py-1 rounded ${Math.abs(calculations.ecart) > 0.01 ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                {calculations.ecart.toFixed(2)}
            </span>
        </div>
        {!isReadOnly && (
            <button onClick={onNext} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Enregistrer et Suivant</button>
        )}
      </div>
    </div>
  );
};

export default BilanPage;
