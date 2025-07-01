

import React from 'react';
import { CreditApplicationData, NouveauCredit, DecisionCredit, CreditEnCours } from '../types.ts';
import {
  sequenceDossierOptions,
  agenceOptions,
  natureCreditOptions,
  secteurActiviteCAEOptions,
  activitePrincipaleOptions,
  decisionOptions,
  remaOptions,
} from '../constants.ts';

interface CreditApplicationPageProps {
    formData: CreditApplicationData;
    setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
    onNext: () => void;
    isReadOnly?: boolean;
}

const FormCell = ({ children, className = '', colSpan = 1, rowSpan = 1, isHeader = false, isSubHeader = false }: { children: any, className?: string, colSpan?: number, rowSpan?: number, isHeader?: boolean, isSubHeader?: boolean }) => {
    const baseClasses = `border border-gray-400 p-1 text-xs flex items-center`;
    const headerClasses = isHeader ? 'bg-gray-200 font-semibold' : isSubHeader ? 'bg-gray-100 font-semibold' : 'bg-white';
    const style = {
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
    };
    return <div style={style} className={`${baseClasses} ${headerClasses} ${className}`}>{children}</div>;
};

const InputField = ({ value = '', onChange, name = '', type = 'text', className = '', readOnly = false, ...rest }) => (
    <input type={type} name={name} value={value ?? ''} onChange={onChange} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} {...rest} />
);

const TextAreaField = ({ value, onChange, name, className = '', rows = 2, readOnly = false, placeholder = '' }) => (
    <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} readOnly={readOnly} placeholder={placeholder} className={`w-full h-full bg-transparent outline-none text-xs p-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} />
);

const SelectField = ({ value, onChange, name, options, className = '', readOnly = false }) => (
    <select name={name} value={value} onChange={onChange} disabled={readOnly} className={`w-full h-full bg-transparent outline-none text-xs ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}>
        <option value=""></option>
        {options.map((opt, i) => <option key={i} value={typeof opt === 'object' ? opt.value : opt}>{typeof opt === 'object' ? opt.label : opt}</option>)}
    </select>
);

const ActionButton = ({ onClick, children, className = '' }) => (
    <button type="button" onClick={onClick} className={`text-xs px-2 py-1 rounded ${className}`}>
        {children}
    </button>
);


const CreditApplicationPage: React.FC<CreditApplicationPageProps> = ({ formData, setFormData, onNext, isReadOnly = false }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (isReadOnly) return;
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name === 'homme' && checked) {
            setFormData(prev => ({ ...prev, homme: true, femme: false }));
            return;
        }
        if (name === 'femme' && checked) {
            setFormData(prev => ({ ...prev, homme: false, femme: true }));
            return;
        }
        
        const targetValue = type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value;
        
        setFormData(prev => ({ 
            ...prev, 
            [name]: targetValue
        }));
    };
    
    const handleNestedChange = <T,>(section: keyof CreditApplicationData, index: number, field: keyof T, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newSectionData = [...(prev[section] as any[])];
            const currentItem = newSectionData[index];
            const fieldType = typeof currentItem[field];
            const finalValue = fieldType === 'number' ? parseFloat(value) || 0 : value;

            newSectionData[index] = { ...newSectionData[index], [field]: finalValue };
            return { ...prev, [section]: newSectionData };
        });
    };
    
    const addRow = <T extends {id: string}>(section: keyof CreditApplicationData, newRowData: Omit<T, 'id'>) => {
        if (isReadOnly) return;
        const newRow = { ...newRowData, id: Date.now().toString() } as T;
        setFormData(prev => ({
            ...prev,
            [section]: [...(prev[section] as any[]), newRow]
        }));
    };

    const removeRow = (section: keyof CreditApplicationData, index: number) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            [section]: (prev[section] as any[]).filter((_, i) => i !== index)
        }));
    };

    const newCreditEnCoursTemplate: Omit<CreditEnCours, 'id'> = {
        nature: '', montantAutorise: 0, montantEncours: 0, montantImpaye: 0, dureeMois: 0, dateFin: '',
        tauxAccorde: 0, rema: '', commentaires: '', controleRema: ''
    };

    const newNouveauCreditTemplate: Omit<NouveauCredit, 'id'> = {
        nature: '', montantDemande: 0, montantPropose: 0, dureeMois: 0, dateFin: '', echeanceFrequence: '',
        echeancePeriode: 'mensuelle', tauxGrille: '', tauxAccorde: '', commentaires: '', col1: 0, col2: 0
    };

    const newDecisionCreditTemplate: Omit<DecisionCredit, 'id'> = {
        natureProposee: '', decision: '', natureAccordee: '', montant: 0, commentaires: ''
    };

    const totalCreditsEnCoursAutorise = formData.creditsEnCours.reduce((sum, credit) => sum + Number(credit.montantAutorise), 0);
    const totalCreditsEnCoursEncours = formData.creditsEnCours.reduce((sum, credit) => sum + Number(credit.montantEncours), 0);
    const totalCreditsEnCoursImpaye = formData.creditsEnCours.reduce((sum, credit) => sum + Number(credit.montantImpaye), 0);
    const totalNouveauxCreditsDemande = formData.nouveauxCredits.reduce((sum, credit) => sum + Number(credit.montantDemande), 0);
    const totalNouveauxCreditsPropose = formData.nouveauxCredits.reduce((sum, credit) => sum + Number(credit.montantPropose), 0);
    const totalDecisionCreditsMontant = formData.decisionNouveauxCredits.reduce((sum, decision) => sum + Number(decision.montant), 0);

    return (
        <div className="bg-white p-4 rounded-lg text-sm">
            {/* Header Section */}
            <div className="grid grid-cols-24 gap-0 mb-2">
                <FormCell colSpan={2} isHeader>Affaire</FormCell>
                <FormCell colSpan={6}><InputField name="affaire" value={formData.affaire} onChange={handleChange} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={8} isHeader className="text-center font-bold text-base">Demande crédit</FormCell>
                <FormCell colSpan={8} isHeader className="text-right font-bold text-base">Dossier {formData.dossier}</FormCell>
            </div>
            
            {/* Identification Section */}
            <div className="grid grid-cols-24 gap-0 mb-2 border border-gray-400">
                <FormCell colSpan={12} isHeader className="text-center">Identification Entreprise ou Entrepreneur</FormCell>
                <FormCell colSpan={4} isHeader className="text-center">Agent bancaire (en charge)</FormCell>
                <FormCell colSpan={4} isHeader className="text-center">Profil</FormCell>
                <FormCell colSpan={4} isHeader className="text-center">Matricule</FormCell>

                <FormCell colSpan={3} isHeader>Dénomination sociale</FormCell>
                <FormCell colSpan={9}><InputField name="denominationSociale" value={formData.denominationSociale} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={2} isHeader>Nom et prénom</FormCell>
                <FormCell colSpan={2}><InputField name="agentBancaireNom" value={formData.agentBancaireNom} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={4}><InputField name="profil" value={formData.profil} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={4}><InputField name="matricule" value={formData.matricule} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                
                <FormCell colSpan={3} isHeader>Nom dirigeant / entrepreneur</FormCell>
                <FormCell colSpan={9} className="!p-0">
                    <div className="flex h-full items-center">
                        <div className="flex-grow"><InputField name="nomDirigeant" value={formData.nomDirigeant} onChange={handleChange} className="px-1" readOnly={isReadOnly}/></div>
                        <div className="flex items-center border-l border-gray-400 px-2 whitespace-nowrap">
                            <label htmlFor="homme" className="text-xs mr-1">Homme</label>
                            <input id="homme" name="homme" type="checkbox" checked={!!formData.homme} onChange={handleChange} className="w-auto h-auto mr-3" disabled={isReadOnly}/>
                            <label htmlFor="femme" className="text-xs mr-1">Femme</label>
                            <input id="femme" name="femme" type="checkbox" checked={!!formData.femme} onChange={handleChange} className="w-auto h-auto" disabled={isReadOnly}/>
                        </div>
                    </div>
                </FormCell>
                <FormCell colSpan={2} isHeader>N° compte</FormCell>
                <FormCell colSpan={10}><InputField name="numeroCompte" value={formData.numeroCompte} onChange={handleChange} readOnly={isReadOnly}/></FormCell>

                <FormCell colSpan={3} isHeader>Forme juridique</FormCell>
                <FormCell colSpan={9} className="!p-0">
                    <div className="flex h-full items-center">
                        <div className="flex-grow"><InputField name="formeJuridique" value={formData.formeJuridique} onChange={handleChange} className="px-1" readOnly={isReadOnly}/></div>
                        <div className="flex items-center border-l border-r border-gray-400 px-1 font-semibold bg-gray-100 whitespace-nowrap">Capital social</div>
                        <div className="flex-grow flex items-center">
                            <InputField name="capitalSocial" value={formData.capitalSocial} onChange={handleChange} className="px-1" readOnly={isReadOnly}/>
                            <span className="text-red-500 font-bold px-1">KFCFA</span>
                        </div>
                    </div>
                </FormCell>
                <FormCell colSpan={3} isHeader>Date Entrée en relation</FormCell>
                <FormCell colSpan={3}><InputField name="dateEntreeRelation" type="date" value={formData.dateEntreeRelation} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={3} isHeader>Date création entreprise</FormCell>
                <FormCell colSpan={3}><InputField name="dateCreationEntreprise" type="date" value={formData.dateCreationEntreprise} onChange={handleChange} readOnly={isReadOnly}/></FormCell>

                <FormCell colSpan={3} isHeader>Activité (description)</FormCell>
                <FormCell colSpan={9}><TextAreaField name="activiteDescription" value={formData.activiteDescription} onChange={handleChange} rows={1} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={3} isHeader>N°Registre commerce</FormCell>
                <FormCell colSpan={9}><InputField name="registreCommerce" value={formData.registreCommerce} onChange={handleChange} readOnly={isReadOnly}/></FormCell>

                <FormCell colSpan={3} isHeader>Secteur d'activité (CAE)</FormCell>
                <FormCell colSpan={9}><SelectField name="secteurActivite" value={formData.secteurActivite} onChange={handleChange} options={secteurActiviteCAEOptions} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={3} isHeader>Siège social</FormCell>
                <FormCell colSpan={9}><InputField name="siegeSocial" value={formData.siegeSocial} onChange={handleChange} readOnly={isReadOnly}/></FormCell>

                <FormCell colSpan={3} isHeader>Activité principale (Code profession)</FormCell>
                <FormCell colSpan={9}><SelectField name="activitePrincipale" value={formData.activitePrincipale} onChange={handleChange} options={activitePrincipaleOptions} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={3} isHeader>Localité</FormCell>
                <FormCell colSpan={9}><InputField name="localite" value={formData.localite} onChange={handleChange} readOnly={isReadOnly}/></FormCell>

                <FormCell colSpan={24} className="bg-yellow-100"><InputField name="syntheseDemande" value={formData.syntheseDemande} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
            </div>
            
             {/* Crédits en cours Section */}
             <div className="grid grid-cols-24 gap-0 mb-2 border border-gray-400">
                <FormCell colSpan={24} isHeader className="text-center font-bold">Crédits en cours au</FormCell>
                <FormCell colSpan={6} isHeader>Nature crédit</FormCell>
                <FormCell colSpan={3} isHeader>Montant (FCFA) Aut</FormCell>
                <FormCell colSpan={2} isHeader>Encours</FormCell>
                <FormCell colSpan={2} isHeader>Impayé</FormCell>
                <FormCell colSpan={1} isHeader>Durée en mois</FormCell>
                <FormCell colSpan={2} isHeader>Date fin JJ/MM/AA</FormCell>
                <FormCell colSpan={1} isHeader>Tx d'i. accordé</FormCell>
                <FormCell colSpan={2} isHeader>REMA</FormCell>
                <FormCell colSpan={5} isHeader>Commentaires (objet / garanties)</FormCell>
                {
                    formData.creditsEnCours.map((credit, index) => (
                        <React.Fragment key={credit.id}>
                            <FormCell colSpan={6}><SelectField name="nature" value={credit.nature} onChange={(e) => handleNestedChange<CreditEnCours>('creditsEnCours', index, 'nature', e.target.value)} options={natureCreditOptions} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={3}><InputField name="montantAutorise" type="number" value={String(credit.montantAutorise)} onChange={(e) => handleNestedChange<CreditEnCours>('creditsEnCours', index, 'montantAutorise', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField name="montantEncours" type="number" value={String(credit.montantEncours)} onChange={(e) => handleNestedChange<CreditEnCours>('creditsEnCours', index, 'montantEncours', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField name="montantImpaye" type="number" value={String(credit.montantImpaye)} onChange={(e) => handleNestedChange<CreditEnCours>('creditsEnCours', index, 'montantImpaye', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={1}><InputField name="dureeMois" type="number" value={String(credit.dureeMois)} onChange={(e) => handleNestedChange<CreditEnCours>('creditsEnCours', index, 'dureeMois', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField name="dateFin" type="date" value={credit.dateFin} onChange={(e) => handleNestedChange<CreditEnCours>('creditsEnCours', index, 'dateFin', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={1}><InputField name="tauxAccorde" type="number" value={String(credit.tauxAccorde)} onChange={(e) => handleNestedChange<CreditEnCours>('creditsEnCours', index, 'tauxAccorde', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><SelectField name="rema" value={credit.rema} onChange={(e) => handleNestedChange<CreditEnCours>('creditsEnCours', index, 'rema', e.target.value)} options={remaOptions} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={4}><InputField name="commentaires" value={credit.commentaires} onChange={(e) => handleNestedChange<CreditEnCours>('creditsEnCours', index, 'commentaires', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('creditsEnCours', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                        </React.Fragment>
                    ))
                }
                <FormCell colSpan={6} isHeader>TOTAL</FormCell>
                <FormCell colSpan={3} isHeader className="text-right">{String(totalCreditsEnCoursAutorise)}</FormCell>
                <FormCell colSpan={2} isHeader className="text-right">{String(totalCreditsEnCoursEncours)}</FormCell>
                <FormCell colSpan={2} isHeader className="text-right">{String(totalCreditsEnCoursImpaye)}</FormCell>
                <FormCell colSpan={11}>{!isReadOnly && <ActionButton onClick={() => addRow<CreditEnCours>('creditsEnCours', newCreditEnCoursTemplate)} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter une ligne</ActionButton>}</FormCell>
             </div>

             {/* Nouveaux crédits Section */}
            <div className="grid grid-cols-24 gap-0 mb-2 border border-gray-400">
                <FormCell colSpan={24} isHeader className="text-center font-bold">Nouveaux crédits</FormCell>
                <FormCell colSpan={6} isHeader>Nature crédit</FormCell>
                <FormCell colSpan={2} isHeader>Montant Dde client</FormCell>
                <FormCell colSpan={2} isHeader>Montant Proposé</FormCell>
                <FormCell colSpan={2} isHeader>Durée mois</FormCell>
                <FormCell colSpan={2} isHeader>Date fin</FormCell>
                <FormCell colSpan={2} isHeader>Échéance FCFA/Périodicité</FormCell>
                <FormCell colSpan={2} isHeader>Taux d'intérêt Grille</FormCell>
                <FormCell colSpan={2} isHeader>Taux d'intérêt Accordé</FormCell>
                <FormCell colSpan={4} isHeader>Commentaires (objet / garanties)</FormCell>
                {
                    formData.nouveauxCredits.map((credit, index) => (
                        <React.Fragment key={credit.id}>
                            <FormCell colSpan={6}><SelectField name="nature" value={credit.nature} onChange={(e) => handleNestedChange<NouveauCredit>('nouveauxCredits', index, 'nature', e.target.value)} options={natureCreditOptions} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField name="montantDemande" type="number" value={String(credit.montantDemande)} onChange={(e) => handleNestedChange<NouveauCredit>('nouveauxCredits', index, 'montantDemande', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField name="montantPropose" type="number" value={String(credit.montantPropose)} onChange={(e) => handleNestedChange<NouveauCredit>('nouveauxCredits', index, 'montantPropose', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField name="dureeMois" type="number" value={String(credit.dureeMois)} onChange={(e) => handleNestedChange<NouveauCredit>('nouveauxCredits', index, 'dureeMois', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField name="dateFin" type="date" value={credit.dateFin} onChange={(e) => handleNestedChange<NouveauCredit>('nouveauxCredits', index, 'dateFin', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField name="echeanceFrequence" value={credit.echeanceFrequence} onChange={(e) => handleNestedChange<NouveauCredit>('nouveauxCredits', index, 'echeanceFrequence', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField name="tauxGrille" value={credit.tauxGrille} onChange={(e) => handleNestedChange<NouveauCredit>('nouveauxCredits', index, 'tauxGrille', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField name="tauxAccorde" value={credit.tauxAccorde} onChange={(e) => handleNestedChange<NouveauCredit>('nouveauxCredits', index, 'tauxAccorde', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={3}><InputField name="commentaires" value={credit.commentaires} onChange={(e) => handleNestedChange<NouveauCredit>('nouveauxCredits', index, 'commentaires', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('nouveauxCredits', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                        </React.Fragment>
                    ))
                }
                 {!isReadOnly && <FormCell colSpan={24}><ActionButton onClick={() => addRow<NouveauCredit>('nouveauxCredits', newNouveauCreditTemplate)} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter une ligne</ActionButton></FormCell>}
                <FormCell colSpan={6} isHeader>TOTAL</FormCell>
                <FormCell colSpan={2} isHeader className="text-right">{String(totalNouveauxCreditsDemande)}</FormCell>
                <FormCell colSpan={2} isHeader className="text-right">{String(totalNouveauxCreditsPropose)}</FormCell>
                <FormCell colSpan={4} isHeader>Échéance moyenne mensuelle (FCFA)</FormCell>
                <FormCell colSpan={2} isHeader className="text-right">0</FormCell>
                <FormCell colSpan={4} isHeader>Total Engagements (FCFA)</FormCell>
                <FormCell colSpan={2} isHeader className="text-right">{String(totalNouveauxCreditsPropose)}</FormCell>
                <FormCell colSpan={2} isHeader>Compétence</FormCell>
            </div>
            
            {/* Decision sur nouveaux crédits Section */}
            <div className="grid grid-cols-24 gap-0 mb-4 border border-gray-400">
                <FormCell colSpan={24} isHeader className="text-center font-bold">Décision sur nouveaux crédits</FormCell>
                <FormCell colSpan={6} isHeader>Nature crédit proposée</FormCell>
                <FormCell colSpan={3} isHeader>Décision</FormCell>
                <FormCell colSpan={6} isHeader>Nature crédit (accordée)</FormCell>
                <FormCell colSpan={3} isHeader>Montant</FormCell>
                <FormCell colSpan={6} isHeader>Commentaires</FormCell>
                {
                    formData.decisionNouveauxCredits.map((decision, index) => (
                        <React.Fragment key={decision.id}>
                            <FormCell colSpan={6}><InputField name="natureProposee" value={decision.natureProposee} onChange={(e) => handleNestedChange<DecisionCredit>('decisionNouveauxCredits', index, 'natureProposee', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={3}><SelectField name="decision" value={decision.decision} onChange={(e) => handleNestedChange<DecisionCredit>('decisionNouveauxCredits', index, 'decision', e.target.value)} options={decisionOptions} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={6}><SelectField name="natureAccordee" value={decision.natureAccordee} onChange={(e) => handleNestedChange<DecisionCredit>('decisionNouveauxCredits', index, 'natureAccordee', e.target.value)} options={natureCreditOptions} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={3}><InputField name="montant" type="number" value={String(decision.montant)} onChange={(e) => handleNestedChange<DecisionCredit>('decisionNouveauxCredits', index, 'montant', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={5}><InputField name="commentaires" value={decision.commentaires} onChange={(e) => handleNestedChange<DecisionCredit>('decisionNouveauxCredits', index, 'commentaires', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('decisionNouveauxCredits', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                        </React.Fragment>
                    ))
                }
                {!isReadOnly && <FormCell colSpan={24}><ActionButton onClick={() => addRow<DecisionCredit>('decisionNouveauxCredits', newDecisionCreditTemplate)} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter une ligne</ActionButton></FormCell>}
                <FormCell colSpan={18} isHeader>TOTAL</FormCell>
                <FormCell colSpan={6} isHeader className="text-right">{String(totalDecisionCreditsMontant)}</FormCell>
            </div>

            {/* Notation/Rentabilité/CIP/Crédit bureau Section */}
            <div className="grid grid-cols-24 gap-0 mb-4 border border-gray-400">
                <FormCell colSpan={24} isHeader className="text-center font-bold">Notation/Rentabilité/CIP/Crédit bureau</FormCell>

                {/* Left Side: Notation & CIP */}
                <div style={{ gridColumn: 'span 8' }} className="grid grid-cols-8 gap-0">
                    <FormCell colSpan={8} isSubHeader>Notation interne</FormCell>
                    <FormCell colSpan={3}>Date notation</FormCell>
                    <FormCell colSpan={5}><InputField name="notationInterneDate" type="date" value={formData.notationInterneDate} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={3}>Note affaire</FormCell>
                    <FormCell colSpan={5}><InputField name="notationInterneAffaire" value={formData.notationInterneAffaire} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={3}>Note groupe</FormCell>
                    <FormCell colSpan={5}><InputField name="notationInterneGroupe" value={formData.notationInterneGroupe} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={3}>Note retenue</FormCell>
                    <FormCell colSpan={5}><InputField name="notationInterneRetenue" value={formData.notationInterneRetenue} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    
                    <FormCell colSpan={8} isSubHeader className="border-t-2 border-gray-500">Centrale Incident de Paiement</FormCell>
                    <FormCell colSpan={8}>Incidents</FormCell>
                    <FormCell colSpan={4} isSubHeader>Montant FCFA</FormCell>
                    <FormCell colSpan={4} isSubHeader>Nombre</FormCell>
                    <FormCell colSpan={8}>Régularisés</FormCell>
                    <FormCell colSpan={4}><InputField name="cipIncidentsRegularisesMontant" value={formData.cipIncidentsRegularisesMontant} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={4}><InputField name="cipIncidentsRegularisesNombre" value={formData.cipIncidentsRegularisesNombre} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={8}>Non Régularisés</FormCell>
                    <FormCell colSpan={4}><InputField name="cipIncidentsNonRegularisesMontant" value={formData.cipIncidentsNonRegularisesMontant} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={4}><InputField name="cipIncidentsNonRegularisesNombre" value={formData.cipIncidentsNonRegularisesNombre} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                </div>

                {/* Right Side: Rentabilité & Crédit Bureau */}
                <div style={{ gridColumn: 'span 16' }} className="grid grid-cols-16 gap-0">
                    <FormCell colSpan={16} isSubHeader>Rentabilité</FormCell>
                    <FormCell colSpan={4} className="justify-start">Date calcul</FormCell>
                    <FormCell colSpan={4}><InputField name="rentabiliteDate" type="date" value={formData.rentabiliteDate} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={4} className="justify-start">PNB (FCFA)</FormCell>
                    <FormCell colSpan={4}><InputField name="rentabilitePnb" value={formData.rentabilitePnb} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={4} className="justify-start">Commentaire</FormCell>
                    <FormCell colSpan={12}><TextAreaField name="rentabiliteCommentaire" value={formData.rentabiliteCommentaire} onChange={handleChange} rows={1} readOnly={isReadOnly}/></FormCell>
                    
                    <FormCell colSpan={16} isSubHeader className="border-t-2 border-gray-500">Crédit Bureau</FormCell>
                    <FormCell colSpan={4} className="justify-start">Date consultation</FormCell>
                    <FormCell colSpan={4}><InputField name="creditBureauDateConsultation" type="date" value={formData.creditBureauDateConsultation} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={4} className="justify-start">Autres Etab.</FormCell>
                    <FormCell colSpan={4}><InputField name="creditBureauAutresEtab" value={formData.creditBureauAutresEtab} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    
                    <FormCell colSpan={8} className="justify-start">Engagements sains (FCFA)</FormCell>
                    <FormCell colSpan={8}><InputField name="creditBureauEngagementsSains" value={formData.creditBureauEngagementsSains} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={8} className="justify-start">Engagements en défaut (FCFA)</FormCell>
                    <FormCell colSpan={8}><InputField name="creditBureauEngagementsDefaut" value={formData.creditBureauEngagementsDefaut} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={8} className="justify-start">Impayés en cours (FCFA)</FormCell>
                    <FormCell colSpan={8}><InputField name="creditBureauImpayes" value={formData.creditBureauImpayes} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={8} className="justify-start">Contentieux (FCFA)</FormCell>
                    <FormCell colSpan={8}><InputField name="creditBureauContentieux" value={formData.creditBureauContentieux} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                    
                    <FormCell colSpan={16} className="justify-start">Commentaire</FormCell>
                    <FormCell colSpan={16} rowSpan={2}><TextAreaField name="creditBureauCommentaire" value={formData.creditBureauCommentaire} onChange={handleChange} rows={3} readOnly={isReadOnly}/></FormCell>
                    <FormCell colSpan={16}>{''}</FormCell>
                </div>
            </div>

            {/* Indicateurs clés Section */}
            <div className="grid grid-cols-12 gap-0 mb-4 border border-gray-400">
                <FormCell colSpan={12} isHeader className="text-center font-bold">Indicateurs clés</FormCell>
                <FormCell colSpan={6} isSubHeader>Libellé</FormCell>
                <FormCell colSpan={3} isSubHeader className="!p-0">
                    <InputField type="date" name="indicateursDateN" value={formData.indicateursDateN} onChange={handleChange} className="text-center font-semibold" readOnly={isReadOnly}/>
                </FormCell>
                <FormCell colSpan={3} isSubHeader className="!p-0">
                    <InputField type="date" name="indicateursDateN1" value={formData.indicateursDateN1} onChange={handleChange} className="text-center font-semibold" readOnly={isReadOnly}/>
                </FormCell>

                <FormCell colSpan={12} isSubHeader className="font-bold bg-gray-300">Montants KFCFA</FormCell>
                <FormCell colSpan={6}>CAHT</FormCell>
                <FormCell colSpan={3} className="!p-0"><InputField name="indicateursCAHTN" value={formData.indicateursCAHTN} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                <FormCell colSpan={3} className="!p-0"><InputField name="indicateursCAHTN1" value={formData.indicateursCAHTN1} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                <FormCell colSpan={6}>Résultat Net</FormCell>
                <FormCell colSpan={3} className="!p-0"><InputField name="indicateursResultatNetN" value={formData.indicateursResultatNetN} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                <FormCell colSpan={3} className="!p-0"><InputField name="indicateursResultatNetN1" value={formData.indicateursResultatNetN1} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                <FormCell colSpan={6}>Mvt confié</FormCell>
                <FormCell colSpan={3} className="!p-0"><InputField name="indicateursMvtConfie12Mois" placeholder="12 derniers mois" value={formData.indicateursMvtConfie12Mois} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                <FormCell colSpan={3} className="!p-0"><InputField name="indicateursMvtConfieN1" placeholder="Année N-1" value={formData.indicateursMvtConfieN1} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>

                <FormCell colSpan={12} isSubHeader className="font-bold bg-gray-300">Ratios</FormCell>
                <FormCell colSpan={6}>FP/Dettes financières {'>'}1</FormCell>
                <FormCell colSpan={3} className="!p-0"><InputField name="ratiosFpDettesN" value={formData.ratiosFpDettesN} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                <FormCell colSpan={3} className="!p-0"><InputField name="ratiosFpDettesN1" value={formData.ratiosFpDettesN1} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                <FormCell colSpan={6}>Actif Net Comptable (KFCFA)</FormCell>
                <FormCell colSpan={3} className="!p-0"><InputField name="ratiosActifNetN" value={formData.ratiosActifNetN} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                <FormCell colSpan={3} className="!p-0"><InputField name="ratiosActifNetN1" value={formData.ratiosActifNetN1} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                <FormCell colSpan={6}>Résultat net/chiffre d'affaires</FormCell>
                <FormCell colSpan={3} className="!p-0"><InputField name="ratiosResultatNetCAN" value={formData.ratiosResultatNetCAN} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                <FormCell colSpan={3} className="!p-0"><InputField name="ratiosResultatNetCAN1" value={formData.ratiosResultatNetCAN1} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                
                <FormCell colSpan={12} isSubHeader className="font-bold bg-gray-300">Cash Flow (FCFA)</FormCell>
                <FormCell colSpan={6}>Cash-Flow Total (CFT) <span className='italic'>(Moyenne raisonnée)</span></FormCell>
                <FormCell colSpan={6} className="!p-0"><InputField name="cashFlowTotalRaisonnee" value={formData.cashFlowTotalRaisonnee} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                <FormCell colSpan={6}>Total Echéances crédit / CFT {'<'} 70%</FormCell>
                <FormCell colSpan={6} className="!p-0"><InputField name="cashFlowEcheancesRaisonnee" value={formData.cashFlowEcheancesRaisonnee} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
                <FormCell colSpan={6}>Total Engagements / CFT (mois)</FormCell>
                <FormCell colSpan={6} className="!p-0"><InputField name="cashFlowEngagementsRaisonnee" value={formData.cashFlowEngagementsRaisonnee} onChange={handleChange} readOnly={isReadOnly} className="text-right"/></FormCell>
            </div>
            
             {/* Capacité d'endettement indicative / Progressivité Section */}
            <div className="grid grid-cols-24 gap-0 mb-4 border border-gray-400">
                <FormCell colSpan={24} isHeader className="text-center font-bold">Capacité d'endettement indicative / Progressivité</FormCell>
                <FormCell colSpan={8} isSubHeader>CREDIT MAXIMUM</FormCell>
                <FormCell colSpan={8} isSubHeader>Rating commercial</FormCell>
                <FormCell colSpan={8} isSubHeader>Progressivité indicative</FormCell>
                
                <FormCell colSpan={8}>(Cash flow raisonné * durée maximum demandée*70%)</FormCell>
                <FormCell colSpan={4}>Total Engagements / Plafond du crédit</FormCell>
                <FormCell colSpan={4} isSubHeader className="bg-gray-50">{''}</FormCell>
                <FormCell colSpan={2} isSubHeader>Cycle</FormCell>
                <FormCell colSpan={1} isSubHeader>Crédit 1</FormCell>
                <FormCell colSpan={1} isSubHeader>Crédit 2</FormCell>
                <FormCell colSpan={2} isSubHeader>Crédit 3</FormCell>
                <FormCell colSpan={2} isSubHeader>Crédit 4</FormCell>

                <FormCell colSpan={2}>Durée (mois)</FormCell>
                <FormCell colSpan={2}><InputField name="creditMaximumDuree" type="number" value={String(formData.creditMaximumDuree)} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={2}>Plafond (FCFA)</FormCell>
                <FormCell colSpan={2}><InputField name="creditMaximumPlafond" type="number" value={String(formData.creditMaximumPlafond)} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={4}>sur 10 (pour info)</FormCell>
                <FormCell colSpan={4}><InputField name="ratingCommercial" type="number" value={String(formData.ratingCommercial)} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={2}>% maxi</FormCell>
                <FormCell colSpan={1}><InputField name="progressiviteCredit1" type="number" value={String(formData.progressiviteCredit1)} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={1}><InputField name="progressiviteCredit2" type="number" value={String(formData.progressiviteCredit2)} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={2}><InputField name="progressiviteCredit3" type="number" value={String(formData.progressiviteCredit3)} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={2}><InputField name="progressiviteCredit4" type="number" value={String(formData.progressiviteCredit4)} onChange={handleChange} readOnly={isReadOnly}/></FormCell>

                <FormCell colSpan={16}>{''}</FormCell>
                <FormCell colSpan={2}>Plafond</FormCell>
                <FormCell colSpan={1}><InputField name="progressivitePlafond1" type="number" value={String(formData.progressivitePlafond1)} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={1}><InputField name="progressivitePlafond2" type="number" value={String(formData.progressivitePlafond2)} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={2}><InputField name="progressivitePlafond3" type="number" value={String(formData.progressivitePlafond3)} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={2}><InputField name="progressivitePlafond4" type="number" value={String(formData.progressivitePlafond4)} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
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

export default CreditApplicationPage;