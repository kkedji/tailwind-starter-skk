

import React from 'react';
import { CreditApplicationData, CompteInterne, CompteExterne, HistoriqueBancaireData } from '../types.ts';

interface HistoriquePageProps {
  formData: CreditApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
  onNext: () => void;
  isReadOnly?: boolean;
}

const FormCell = ({ children, className = '', colSpan = 1, rowSpan = 1, isHeader = false, isSubHeader = false, isTitle = false, isLabel = false }: { children: any, className?: string, colSpan?: number, rowSpan?: number, isHeader?: boolean, isSubHeader?: boolean, isTitle?: boolean, isLabel?: boolean }) => {
    const baseClasses = 'border border-gray-400 p-1 text-xs flex items-center justify-center';
    const bgClasses = isTitle ? 'bg-gray-300 font-bold' : isHeader ? 'bg-gray-200 font-semibold' : isSubHeader ? 'bg-gray-100 font-semibold' : 'bg-white';
    const style = {
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
    };
    return <div style={style} className={`${baseClasses} ${bgClasses} ${className}`}>{children}</div>;
};

const InputField = ({ value, onChange, name = '', type = 'text', className = '', readOnly = false, ...rest }) => (
    <input type={type} name={name} value={value ?? ''} onChange={onChange} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs px-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} {...rest} />
);

const TextAreaField = ({ value, onChange, name, className = '', rows = 2, placeholder = '', readOnly = false }) => (
    <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} placeholder={placeholder} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs p-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} />
);

const ActionButton = ({ onClick, children, className = '' }) => (
    <button type="button" onClick={onClick} className={`text-xs px-2 py-1 rounded ${className}`}>
        {children}
    </button>
);

const HistoriquePage: React.FC<HistoriquePageProps> = ({ formData, setFormData, onNext, isReadOnly = false }) => {

    const { historiqueBancaire } = formData;
    
    const handleFieldChange = (field: keyof HistoriqueBancaireData, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            historiqueBancaire: {
                ...prev.historiqueBancaire,
                [field]: value
            }
        }));
    };

    const handleTableChange = <T,>(section: 'comptesInternes' | 'comptesExternes', index: number, field: keyof T, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newTableData = [...prev.historiqueBancaire[section] as any[]];
            const currentItem = newTableData[index];
            const fieldType = typeof currentItem[field];
            const finalValue = fieldType === 'number' ? parseFloat(value) || 0 : value;
            
            newTableData[index] = { ...currentItem, [field]: finalValue };
            
            return {
                ...prev,
                historiqueBancaire: {
                    ...prev.historiqueBancaire,
                    [section]: newTableData
                }
            };
        });
    };
    
    const addRow = <T extends { id: string }>(section: 'comptesInternes' | 'comptesExternes', newRowData: Omit<T, 'id'>) => {
        if (isReadOnly) return;
        const newRow = { ...newRowData, id: Date.now().toString() } as T;
        setFormData(prev => ({
            ...prev,
            historiqueBancaire: {
                ...prev.historiqueBancaire,
                [section]: [...prev.historiqueBancaire[section], newRow]
            }
        }));
    };

    const removeRow = (section: 'comptesInternes' | 'comptesExternes', index: number) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            historiqueBancaire: {
                ...prev.historiqueBancaire,
                [section]: prev.historiqueBancaire[section].filter((_, i) => i !== index)
            }
        }));
    };

    const newCompteInterneTemplate: Omit<CompteInterne, 'id'> = { beneficiaireCompte: '', numeroCompte: '', dateOuverture: '', mvtsConfiesN1: 0, mvtsConfies12Mois: 0, soldeMoyenN1: 0, soldeMoyen12Mois: 0, joursDebiteursN1: 0, joursDebiteurs12Mois: 0, joursDepassementN1: 0, joursDepassement12Mois: 0, joursCrediteursN1: 0, joursCrediteurs12Mois: 0 };
    const newCompteExterneTemplate: Omit<CompteExterne, 'id'> = { banque: '', nomBeneficiaire: '', dateEntreeRelation: '', mvtsConfiesN1: 0, mvtsConfies12Mois: 0, soldeMoyenN1: 0, soldeMoyen12Mois: 0, joursDebiteursN1: 0, joursDebiteurs12Mois: 0, joursDepassementN1: 0, joursDepassement12Mois: 0, joursCrediteursN1: 0, joursCrediteurs12Mois: 0 };
    
    const calculateTotal = (section: 'comptesInternes' | 'comptesExternes', field: keyof (CompteInterne | CompteExterne)) => {
        return historiqueBancaire[section].reduce((sum, item) => sum + Number(item[field]), 0);
    }
    
    const totalInternes = {
        mvtsConfiesN1: calculateTotal('comptesInternes', 'mvtsConfiesN1'),
        mvtsConfies12Mois: calculateTotal('comptesInternes', 'mvtsConfies12Mois'),
        soldeMoyenN1: calculateTotal('comptesInternes', 'soldeMoyenN1'),
        soldeMoyen12Mois: calculateTotal('comptesInternes', 'soldeMoyen12Mois'),
        joursDebiteursN1: calculateTotal('comptesInternes', 'joursDebiteursN1'),
        joursDebiteurs12Mois: calculateTotal('comptesInternes', 'joursDebiteurs12Mois'),
        joursDepassementN1: calculateTotal('comptesInternes', 'joursDepassementN1'),
        joursDepassement12Mois: calculateTotal('comptesInternes', 'joursDepassement12Mois'),
        joursCrediteursN1: calculateTotal('comptesInternes', 'joursCrediteursN1'),
        joursCrediteurs12Mois: calculateTotal('comptesInternes', 'joursCrediteurs12Mois'),
    }
    const totalExternes = {
        mvtsConfiesN1: calculateTotal('comptesExternes', 'mvtsConfiesN1'),
        mvtsConfies12Mois: calculateTotal('comptesExternes', 'mvtsConfies12Mois'),
        soldeMoyenN1: calculateTotal('comptesExternes', 'soldeMoyenN1'),
        soldeMoyen12Mois: calculateTotal('comptesExternes', 'soldeMoyen12Mois'),
        joursDebiteursN1: calculateTotal('comptesExternes', 'joursDebiteursN1'),
        joursDebiteurs12Mois: calculateTotal('comptesExternes', 'joursDebiteurs12Mois'),
        joursDepassementN1: calculateTotal('comptesExternes', 'joursDepassementN1'),
        joursDepassement12Mois: calculateTotal('comptesExternes', 'joursDepassement12Mois'),
        joursCrediteursN1: calculateTotal('comptesExternes', 'joursCrediteursN1'),
        joursCrediteurs12Mois: calculateTotal('comptesExternes', 'joursCrediteurs12Mois'),
    }
    
    const partMvtsN1Pct = historiqueBancaire.cahtN > 0 ? ((totalInternes.mvtsConfiesN1 + totalExternes.mvtsConfiesN1) / historiqueBancaire.cahtN) * 100 : 0;
    const partMvts12MPct = historiqueBancaire.cattcReel > 0 ? ((totalInternes.mvtsConfies12Mois + totalExternes.mvtsConfies12Mois) / historiqueBancaire.cattcReel) * 100 : 0;


    return (
        <div className="bg-white p-4 rounded-lg text-sm">
            {/* Header */}
            <div className="grid grid-cols-24 gap-0 mb-2">
                <FormCell colSpan={3} isHeader>Affaire</FormCell>
                <FormCell colSpan={5} isSubHeader>{formData.affaire}</FormCell>
                <FormCell colSpan={8} isHeader className="text-center font-bold text-base">HISTORIQUE BANCAIRE</FormCell>
                <FormCell colSpan={8} isHeader className="text-right font-bold">Dossier {formData.dossier}</FormCell>
                <FormCell colSpan={3} isHeader>Date ouverture du dossier</FormCell>
                <FormCell colSpan={5}><InputField type="date" name="dateOuvertureDossier" value={formData.dateOuvertureDossier} onChange={e => setFormData({...formData, dateOuvertureDossier: e.target.value})} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={8} isHeader className="text-center">TABLEAU DE BORD STATISTIQUE DE COMPTE (2 dernières années)</FormCell>
                <FormCell colSpan={3} isHeader>Date Entrée en relation</FormCell>
                <FormCell colSpan={5}><InputField type="date" name="dateEntreeRelation" value={historiqueBancaire.dateEntreeRelation} onChange={e => handleFieldChange('dateEntreeRelation', e.target.value)} readOnly={isReadOnly} /></FormCell>
            </div>

            <div className="grid grid-cols-25 gap-0 mb-2 border-t-2 border-gray-500 text-center">
                <FormCell colSpan={25} isTitle className="bg-yellow-100">Montants à renseigner en KFCFA (- pour les soldes débiteurs)</FormCell>
                
                {/* Comptes Internes */}
                <FormCell colSpan={25} isHeader>Comptes ouverts auprès de la banque</FormCell>
                <FormCell colSpan={3} rowSpan={2} isHeader>Bénéficiaire Compte</FormCell>
                <FormCell colSpan={2} rowSpan={2} isHeader>N° compte</FormCell>
                <FormCell colSpan={2} rowSpan={2} isHeader>Date ouverture</FormCell>
                <FormCell colSpan={2} isHeader>Mvts confiés en KFCFA</FormCell>
                <FormCell colSpan={2} isHeader>Solde moyen en KFCFA</FormCell>
                <FormCell colSpan={4} isHeader>NbJr: Nbre jours Débiteurs</FormCell>
                <FormCell colSpan={4} isHeader>Nbjlr: Nbre jours dépassement</FormCell>
                <FormCell colSpan={4} isHeader>NbJr: Nbre jours Créditeurs</FormCell>
                <FormCell colSpan={2} rowSpan={2} isHeader>Action</FormCell>

                <FormCell isSubHeader>N-1</FormCell>
                <FormCell isSubHeader>12 mois glissants</FormCell>
                <FormCell isSubHeader>N-1</FormCell>
                <FormCell isSubHeader>12 mois glissants</FormCell>
                <FormCell colSpan={2} isSubHeader>N-1</FormCell>
                <FormCell colSpan={2} isSubHeader>12 mois glissants</FormCell>
                <FormCell colSpan={2} isSubHeader>N-1</FormCell>
                <FormCell colSpan={2} isSubHeader>12 mois glissants</FormCell>
                <FormCell colSpan={2} isSubHeader>N-1</FormCell>
                <FormCell colSpan={2} isSubHeader>12 mois glissants</FormCell>

                {historiqueBancaire.comptesInternes.map((compte, index) => (
                    <React.Fragment key={compte.id}>
                        <FormCell colSpan={3}><InputField value={compte.beneficiaireCompte} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'beneficiaireCompte', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField value={compte.numeroCompte} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'numeroCompte', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="date" value={compte.dateOuverture} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'dateOuverture', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell><InputField type="number" value={String(compte.mvtsConfiesN1)} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'mvtsConfiesN1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell><InputField type="number" value={String(compte.mvtsConfies12Mois)} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'mvtsConfies12Mois', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell><InputField type="number" value={String(compte.soldeMoyenN1)} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'soldeMoyenN1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell><InputField type="number" value={String(compte.soldeMoyen12Mois)} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'soldeMoyen12Mois', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="number" value={String(compte.joursDebiteursN1)} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'joursDebiteursN1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="number" value={String(compte.joursDebiteurs12Mois)} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'joursDebiteurs12Mois', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="number" value={String(compte.joursDepassementN1)} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'joursDepassementN1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="number" value={String(compte.joursDepassement12Mois)} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'joursDepassement12Mois', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="number" value={String(compte.joursCrediteursN1)} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'joursCrediteursN1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="number" value={String(compte.joursCrediteurs12Mois)} onChange={e => handleTableChange<CompteInterne>('comptesInternes', index, 'joursCrediteurs12Mois', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}>{!isReadOnly && <ActionButton onClick={() => removeRow('comptesInternes', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                    </React.Fragment>
                ))}
                {!isReadOnly && <FormCell colSpan={25}><ActionButton onClick={() => addRow('comptesInternes', newCompteInterneTemplate)} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter</ActionButton></FormCell>}
                <FormCell colSpan={7} isHeader>TOTAL</FormCell>
                <FormCell isHeader>{totalInternes.mvtsConfiesN1}</FormCell>
                <FormCell isHeader>{totalInternes.mvtsConfies12Mois}</FormCell>
                <FormCell isHeader>{totalInternes.soldeMoyenN1}</FormCell>
                <FormCell isHeader>{totalInternes.soldeMoyen12Mois}</FormCell>
                <FormCell colSpan={2} isHeader>{totalInternes.joursDebiteursN1}</FormCell>
                <FormCell colSpan={2} isHeader>{totalInternes.joursDebiteurs12Mois}</FormCell>
                <FormCell colSpan={2} isHeader>{totalInternes.joursDepassementN1}</FormCell>
                <FormCell colSpan={2} isHeader>{totalInternes.joursDepassement12Mois}</FormCell>
                <FormCell colSpan={2} isHeader>{totalInternes.joursCrediteursN1}</FormCell>
                <FormCell colSpan={2} isHeader>{totalInternes.joursCrediteurs12Mois}</FormCell>
                <FormCell colSpan={2}>{''}</FormCell>

                {/* Comptes Externes */}
                <FormCell colSpan={25} isHeader className="mt-2">Relations bancaires : Autres banques</FormCell>
                <FormCell colSpan={3} rowSpan={2} isHeader>Banque</FormCell>
                <FormCell colSpan={2} rowSpan={2} isHeader>Nom du bénéficiaire (compte)</FormCell>
                <FormCell colSpan={2} rowSpan={2} isHeader>Date entrée en relation</FormCell>
                <FormCell colSpan={2} isHeader>Mvts confiés en KFCFA</FormCell>
                <FormCell colSpan={2} isHeader>Solde moyen en KFCFA</FormCell>
                <FormCell colSpan={4} isHeader>Nbre jours Débiteurs</FormCell>
                <FormCell colSpan={4} isHeader>Nbre jours dépassement</FormCell>
                <FormCell colSpan={4} isHeader>Nbre jours Créditeurs</FormCell>
                <FormCell colSpan={2} rowSpan={2} isHeader>Action</FormCell>

                <FormCell isSubHeader>N-1</FormCell>
                <FormCell isSubHeader>12 mois glissants</FormCell>
                <FormCell isSubHeader>N-1</FormCell>
                <FormCell isSubHeader>12 mois glissants</FormCell>
                <FormCell colSpan={2} isSubHeader>N-1</FormCell>
                <FormCell colSpan={2} isSubHeader>12 mois glissants</FormCell>
                <FormCell colSpan={2} isSubHeader>N-1</FormCell>
                <FormCell colSpan={2} isSubHeader>12 mois glissants</FormCell>
                <FormCell colSpan={2} isSubHeader>N-1</FormCell>
                <FormCell colSpan={2} isSubHeader>12 mois glissants</FormCell>

                {historiqueBancaire.comptesExternes.map((compte, index) => (
                    <React.Fragment key={compte.id}>
                        <FormCell colSpan={3}><InputField value={compte.banque} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'banque', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField value={compte.nomBeneficiaire} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'nomBeneficiaire', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="date" value={compte.dateEntreeRelation} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'dateEntreeRelation', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell><InputField type="number" value={String(compte.mvtsConfiesN1)} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'mvtsConfiesN1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell><InputField type="number" value={String(compte.mvtsConfies12Mois)} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'mvtsConfies12Mois', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell><InputField type="number" value={String(compte.soldeMoyenN1)} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'soldeMoyenN1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell><InputField type="number" value={String(compte.soldeMoyen12Mois)} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'soldeMoyen12Mois', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="number" value={String(compte.joursDebiteursN1)} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'joursDebiteursN1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="number" value={String(compte.joursDebiteurs12Mois)} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'joursDebiteurs12Mois', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="number" value={String(compte.joursDepassementN1)} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'joursDepassementN1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="number" value={String(compte.joursDepassement12Mois)} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'joursDepassement12Mois', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="number" value={String(compte.joursCrediteursN1)} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'joursCrediteursN1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}><InputField type="number" value={String(compte.joursCrediteurs12Mois)} onChange={e => handleTableChange<CompteExterne>('comptesExternes', index, 'joursCrediteurs12Mois', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={2}>{!isReadOnly && <ActionButton onClick={() => removeRow('comptesExternes', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                    </React.Fragment>
                ))}
                {!isReadOnly && <FormCell colSpan={25}><ActionButton onClick={() => addRow('comptesExternes', newCompteExterneTemplate)} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter</ActionButton></FormCell>}
                <FormCell colSpan={7} isHeader>TOTAL</FormCell>
                <FormCell isHeader>{totalExternes.mvtsConfiesN1}</FormCell>
                <FormCell isHeader>{totalExternes.mvtsConfies12Mois}</FormCell>
                <FormCell isHeader>{totalExternes.soldeMoyenN1}</FormCell>
                <FormCell isHeader>{totalExternes.soldeMoyen12Mois}</FormCell>
                <FormCell colSpan={2} isHeader>{totalExternes.joursDebiteursN1}</FormCell>
                <FormCell colSpan={2} isHeader>{totalExternes.joursDebiteurs12Mois}</FormCell>
                <FormCell colSpan={2} isHeader>{totalExternes.joursDepassementN1}</FormCell>
                <FormCell colSpan={2} isHeader>{totalExternes.joursDepassement12Mois}</FormCell>
                <FormCell colSpan={2} isHeader>{totalExternes.joursCrediteursN1}</FormCell>
                <FormCell colSpan={2} isHeader>{totalExternes.joursCrediteurs12Mois}</FormCell>
                <FormCell colSpan={2}>{''}</FormCell>

                {/* Synthèse CA */}
                 <FormCell colSpan={25} isHeader className="mt-2">Synthèse et Rapprochement du Chiffre d'Affaires</FormCell>
                 <FormCell colSpan={5} isSubHeader>CAHT N (en KFCFA)</FormCell>
                 <FormCell colSpan={3}><InputField type="number" value={String(historiqueBancaire.cahtN)} onChange={e => handleFieldChange('cahtN', parseFloat(e.target.value) || 0)} readOnly={isReadOnly}/></FormCell>
                 <FormCell colSpan={8} isSubHeader>%Part de mouvements N-1 / CA déclaré</FormCell>
                 <FormCell colSpan={9} isSubHeader className="bg-yellow-100 !p-0">
                    <InputField type="number" value={String(historiqueBancaire.partMvtsN1Pct ?? partMvtsN1Pct.toFixed(2))} onChange={(e) => handleFieldChange('partMvtsN1Pct', parseFloat(e.target.value))} readOnly={isReadOnly}/>
                 </FormCell>
                 
                 <FormCell colSpan={5} isSubHeader>CATTC REEL (trésorerie)</FormCell>
                 <FormCell colSpan={3}><InputField type="number" value={String(historiqueBancaire.cattcReel)} onChange={e => handleFieldChange('cattcReel', parseFloat(e.target.value) || 0)} readOnly={isReadOnly}/></FormCell>
                 <FormCell colSpan={8} isSubHeader>%Part de mvts 12M / CA réel (cash-flow)</FormCell>
                 <FormCell colSpan={9} isSubHeader className="bg-yellow-100 !p-0">
                    <InputField type="number" value={String(historiqueBancaire.partMvts12MPct ?? partMvts12MPct.toFixed(2))} onChange={(e) => handleFieldChange('partMvts12MPct', parseFloat(e.target.value))} readOnly={isReadOnly}/>
                 </FormCell>
            </div>
            
            {/* Synthèse Commentaire */}
            <div className="grid grid-cols-24 gap-0 mt-4 border-t-2 border-gray-500">
                <FormCell colSpan={24} isHeader>Synthèse de l'historique bancaire et des mouvements de compte</FormCell>
                <FormCell colSpan={24} className="!p-0">
                    <TextAreaField 
                        name="commentaires"
                        rows={6}
                        placeholder="Analyse des mouvements, cohérence avec l'activité, incidents, soldes moyens, etc."
                        value={historiqueBancaire.commentaires}
                        onChange={e => handleFieldChange('commentaires', e.target.value)}
                        className="bg-yellow-50"
                        readOnly={isReadOnly}
                    />
                </FormCell>
            </div>

            {!isReadOnly && (
                <div className="flex justify-end mt-6">
                    <button type="button" onClick={onNext} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200">
                        Enregistrer et Suivant
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistoriquePage;
