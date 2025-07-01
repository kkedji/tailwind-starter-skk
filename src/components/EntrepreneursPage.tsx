
import React from 'react';
import { CreditApplicationData, Entrepreneur, RelationBancaire, HistoriqueCredit, AutreAffaire, SurfacePatrimonialeItem } from '../types.ts';
import { genreOptions, situationFamilialeOptions, habitationOptions, niveauEtudesOptions, typeBienOptions } from '../constants.ts';

interface EntrepreneursPageProps {
  formData: CreditApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
  onNext: () => void;
  isReadOnly?: boolean;
}

const FormCell = ({ children, className = '', colSpan = 1, rowSpan = 1, isHeader = false, isSubHeader = false, isTitle = false }) => {
    const baseClasses = 'border border-gray-400 p-1 text-xs flex items-center';
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

const SelectField = ({ value, onChange, name, options, className = '', readOnly = false }) => (
    <select name={name} value={value} onChange={onChange} disabled={readOnly} className={`w-full h-full bg-transparent outline-none text-xs ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}>
        <option value=""></option>
        {options.map((opt, i) => <option key={i} value={typeof opt === 'object' ? opt.value : opt}>{typeof opt === 'object' ? opt.label : opt}</option>)}
    </select>
);

const TextAreaField = ({ value, onChange, name, className = '', rows = 2, readOnly = false, placeholder='' }) => (
    <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} readOnly={readOnly} placeholder={placeholder} className={`w-full h-full bg-transparent outline-none text-xs p-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} />
);

const ActionButton = ({ onClick, children, className = '' }) => (
    <button type="button" onClick={onClick} className={`text-xs px-2 py-1 rounded ${className}`}>
        {children}
    </button>
);


const EntrepreneursPage: React.FC<EntrepreneursPageProps> = ({ formData, setFormData, onNext, isReadOnly = false }) => {
    
    const handleEntrepreneurChange = (index: number, field: keyof Entrepreneur, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newEntrepreneurs = [...prev.entrepreneurs] as [Entrepreneur, Entrepreneur];
            newEntrepreneurs[index] = { ...newEntrepreneurs[index], [field]: value };
            return { ...prev, entrepreneurs: newEntrepreneurs };
        });
    };

    const handleNestedChange = <T,>(section: keyof CreditApplicationData, index: number, field: keyof T, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newSectionData = [...(prev[section] as any[])];
            const currentItem = newSectionData[index];
            const fieldType = typeof currentItem[field];
            
            let finalValue = value;
            if (fieldType === 'number') {
                finalValue = parseFloat(value) || 0;
            }

            newSectionData[index] = { ...currentItem, [field]: finalValue };
            return { ...prev, [section]: newSectionData };
        });
    };

    const handleRelationsBancairesChange = (entIndex: number, relIndex: number, field: keyof RelationBancaire, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newEntrepreneurs = [...prev.entrepreneurs] as [Entrepreneur, Entrepreneur];
            const newRelations = [...newEntrepreneurs[entIndex].relationsBancaires];
            
            const currentItem = newRelations[relIndex];
            const fieldType = typeof currentItem[field];

            let finalValue = value;
            if (fieldType === 'number') {
                finalValue = parseFloat(value) || 0;
            }

            newRelations[relIndex] = { ...currentItem, [field]: finalValue };
            newEntrepreneurs[entIndex] = { ...newEntrepreneurs[entIndex], relationsBancaires: newRelations };
            return { ...prev, entrepreneurs: newEntrepreneurs };
        });
    }

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

    const addRelationBancaire = (entIndex: number) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newEntrepreneurs = [...prev.entrepreneurs] as [Entrepreneur, Entrepreneur];
            const newRelation = { id: Date.now().toString(), banque: '', numeroCompte: '', ouvertureCompte: '', solde: 0, mouvementsN1: 0, mouvementsN: 0, incidents: 0 };
            const newRelations = [...newEntrepreneurs[entIndex].relationsBancaires, newRelation];
            newEntrepreneurs[entIndex] = { ...newEntrepreneurs[entIndex], relationsBancaires: newRelations };
            return { ...prev, entrepreneurs: newEntrepreneurs };
        });
    };

    const removeRelationBancaire = (entIndex: number, relIndex: number) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newEntrepreneurs = [...prev.entrepreneurs] as [Entrepreneur, Entrepreneur];
            const newRelations = newEntrepreneurs[entIndex].relationsBancaires.filter((_, i) => i !== relIndex);
            newEntrepreneurs[entIndex] = { ...newEntrepreneurs[entIndex], relationsBancaires: newRelations };
            return { ...prev, entrepreneurs: newEntrepreneurs };
        });
    };

    const newHistoriqueCreditTemplate: Omit<HistoriqueCredit, 'id'> = { nomEntrepreneur: '', banque: '', dateOctroi: '', objetType: '', montant: 0, dureeMois: 0, mtEcheance: 0, encours: 0, impayes: 0, renseignements: '' };
    const newAutreAffaireTemplate: Omit<AutreAffaire, 'id'> = { denomination: '', capital: 0, partEntrepreneur: 0, nomPrenom: '', activite: '', chiffreAffaires: 0, banque: '' };
    const newSurfacePatrimonialeItemTemplate: Omit<SurfacePatrimonialeItem, 'id'> = { entrepreneur: '', part: 0, bien: 'Appartement', reference: '', consistance: '', valVenale: 0, capitalRestantDu: 0 };

    const EntrepreneurIdSection = ({ entrepreneur, index }: { entrepreneur: Entrepreneur, index: number }) => (
        <div className="grid grid-cols-12 gap-0">
            <FormCell colSpan={3} isHeader>Nom</FormCell>
            <FormCell colSpan={9}><InputField name="nom" value={entrepreneur.nom} onChange={e => handleEntrepreneurChange(index, 'nom', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={3} isHeader>Prénom</FormCell>
            <FormCell colSpan={9}><InputField name="prenom" value={entrepreneur.prenom} onChange={e => handleEntrepreneurChange(index, 'prenom', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={3} isHeader>N° CNI</FormCell>
            <FormCell colSpan={9}><InputField name="cni" value={entrepreneur.cni} onChange={e => handleEntrepreneurChange(index, 'cni', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={3} isHeader>Téléphone</FormCell>
            <FormCell colSpan={9}><InputField name="telephone" value={entrepreneur.telephone} onChange={e => handleEntrepreneurChange(index, 'telephone', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={3} isHeader>Date de naissance</FormCell>
            <FormCell colSpan={3}><InputField type="date" name="dateNaissance" value={entrepreneur.dateNaissance} onChange={e => handleEntrepreneurChange(index, 'dateNaissance', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={3} isHeader>Age</FormCell>
            <FormCell colSpan={3}><InputField name="age" value={entrepreneur.age} onChange={e => handleEntrepreneurChange(index, 'age', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={3} isHeader>Situation familiale</FormCell>
            <FormCell colSpan={5}><SelectField name="situationFamiliale" value={entrepreneur.situationFamiliale} options={situationFamilialeOptions} onChange={e => handleEntrepreneurChange(index, 'situationFamiliale', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={2} isHeader>Genre</FormCell>
            <FormCell colSpan={2}><SelectField name="genre" value={entrepreneur.genre} options={genreOptions} onChange={e => handleEntrepreneurChange(index, 'genre', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={3} isHeader>Nb pers. à charge</FormCell>
            <FormCell colSpan={9}><InputField type="number" name="nbPersACharge" value={String(entrepreneur.nbPersACharge)} onChange={e => handleEntrepreneurChange(index, 'nbPersACharge', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={3} isHeader>Adresse</FormCell>
            <FormCell colSpan={9}><InputField name="adresse" value={entrepreneur.adresse} onChange={e => handleEntrepreneurChange(index, 'adresse', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={3} isHeader>Habitation</FormCell>
            <FormCell colSpan={9}><SelectField name="habitation" value={entrepreneur.habitation} options={habitationOptions} onChange={e => handleEntrepreneurChange(index, 'habitation', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={3} isHeader>Niveau d'études</FormCell>
            <FormCell colSpan={9}><SelectField name="niveauEtudes" value={entrepreneur.niveauEtudes} options={niveauEtudesOptions} onChange={e => handleEntrepreneurChange(index, 'niveauEtudes', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={3} isHeader>Autres études et diplômes</FormCell>
            <FormCell colSpan={5}><InputField name="autresEtudes" value={entrepreneur.autresEtudes} onChange={e => handleEntrepreneurChange(index, 'autresEtudes', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={2} isHeader>Spécialité</FormCell>
            <FormCell colSpan={2}><InputField name="specialite" value={entrepreneur.specialite} onChange={e => handleEntrepreneurChange(index, 'specialite', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={12} isHeader>Expérience profess.</FormCell>
            <FormCell colSpan={3} isSubHeader>Globale (années)</FormCell>
            <FormCell colSpan={3}><InputField name="experienceProGlobale" value={entrepreneur.experienceProGlobale} onChange={e => handleEntrepreneurChange(index, 'experienceProGlobale', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={3} isSubHeader>Secteur (années)</FormCell>
            <FormCell colSpan={3}><InputField name="experienceProSecteur" value={entrepreneur.experienceProSecteur} onChange={e => handleEntrepreneurChange(index, 'experienceProSecteur', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={12}><TextAreaField rows={1} name="experienceProDetaillee" value={entrepreneur.experienceProDetaillee} onChange={e => handleEntrepreneurChange(index, 'experienceProDetaillee', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={12} isHeader>Environnement familial</FormCell>
            <FormCell colSpan={12}><TextAreaField rows={1} name="environnementFamilial" value={entrepreneur.environnementFamilial} onChange={e => handleEntrepreneurChange(index, 'environnementFamilial', e.target.value)} readOnly={isReadOnly}/></FormCell>
            <FormCell colSpan={12} isHeader>Compétences en management</FormCell>
            <FormCell colSpan={12}><TextAreaField rows={1} name="competencesManagement" value={entrepreneur.competencesManagement} onChange={e => handleEntrepreneurChange(index, 'competencesManagement', e.target.value)} readOnly={isReadOnly}/></FormCell>
        </div>
    );
    
    return (
        <div className="bg-white p-4 rounded-lg text-sm">
            {/* Header */}
            <div className="grid grid-cols-24 gap-0 mb-2">
                <FormCell colSpan={2} isHeader>Affaire</FormCell>
                <FormCell colSpan={6} isSubHeader>{formData.affaire}</FormCell>
                <FormCell colSpan={8} isHeader className="text-center font-bold text-base">ENTREPRENEURS</FormCell>
                <FormCell colSpan={8} isHeader className="text-right font-bold">Dossier {formData.dossier}</FormCell>
                <FormCell colSpan={2} isHeader>Date ouverture du dossier</FormCell>
                <FormCell colSpan={6}><InputField type="date" name="dateOuvertureDossier" value={formData.dateOuvertureDossier} onChange={e => setFormData({...formData, dateOuvertureDossier: e.target.value})} readOnly={isReadOnly} /></FormCell>
            </div>
            
            {/* Identification */}
            <div className="mb-2 border-t-4 border-gray-500">
                <FormCell colSpan={24} isTitle>Identification Entrepreneur(s) / Principaux actionnaires</FormCell>
                <div className="grid grid-cols-2 gap-4">
                    <EntrepreneurIdSection entrepreneur={formData.entrepreneurs[0]} index={0} />
                    <EntrepreneurIdSection entrepreneur={formData.entrepreneurs[1]} index={1} />
                </div>
            </div>

            {/* Relations bancaires */}
            <div className="mb-2 border-t-2 border-gray-400">
                <FormCell colSpan={24} isTitle>Relations bancaires à titres personnel</FormCell>
                <div className="grid grid-cols-2 gap-4">
                    {formData.entrepreneurs.map((ent, entIndex) => {
                        const totalSolde = ent.relationsBancaires.reduce((sum, item) => sum + Number(item.solde), 0);
                        const totalMvtsN1 = ent.relationsBancaires.reduce((sum, item) => sum + Number(item.mouvementsN1), 0);
                        const totalMvtsN = ent.relationsBancaires.reduce((sum, item) => sum + Number(item.mouvementsN), 0);
                        const totalIncidents = ent.relationsBancaires.reduce((sum, item) => sum + Number(item.incidents), 0);
                        return (
                            <div key={entIndex} className="grid grid-cols-12 gap-0 border">
                                <FormCell colSpan={12} isHeader>{ent.nom || `Entrepreneur ${entIndex + 1}`}</FormCell>
                                
                                <FormCell colSpan={3} isSubHeader>Banque</FormCell>
                                <FormCell colSpan={2} isSubHeader>N° Cpte</FormCell>
                                <FormCell colSpan={2} isSubHeader>Ouvert.</FormCell>
                                <FormCell colSpan={1} isSubHeader>Solde</FormCell>
                                <FormCell colSpan={1} isSubHeader>Mvts N-1</FormCell>
                                <FormCell colSpan={1} isSubHeader>Mvts N</FormCell>
                                <FormCell colSpan={1} isSubHeader>Incid.</FormCell>
                                <FormCell colSpan={1} isSubHeader>Act.</FormCell>

                                {ent.relationsBancaires.map((rel, relIndex) => (
                                    <React.Fragment key={rel.id}>
                                        <FormCell colSpan={3}><InputField name="banque" value={rel.banque} onChange={e => handleRelationsBancairesChange(entIndex, relIndex, 'banque', e.target.value)} readOnly={isReadOnly}/></FormCell>
                                        <FormCell colSpan={2}><InputField name="numeroCompte" value={rel.numeroCompte} onChange={e => handleRelationsBancairesChange(entIndex, relIndex, 'numeroCompte', e.target.value)} readOnly={isReadOnly}/></FormCell>
                                        <FormCell colSpan={2}><InputField type="date" name="ouvertureCompte" value={rel.ouvertureCompte} onChange={e => handleRelationsBancairesChange(entIndex, relIndex, 'ouvertureCompte', e.target.value)} readOnly={isReadOnly}/></FormCell>
                                        <FormCell colSpan={1}><InputField type="number" name="solde" value={String(rel.solde)} onChange={e => handleRelationsBancairesChange(entIndex, relIndex, 'solde', e.target.value)} readOnly={isReadOnly}/></FormCell>
                                        <FormCell colSpan={1}><InputField type="number" name="mouvementsN1" value={String(rel.mouvementsN1)} onChange={e => handleRelationsBancairesChange(entIndex, relIndex, 'mouvementsN1', e.target.value)} readOnly={isReadOnly}/></FormCell>
                                        <FormCell colSpan={1}><InputField type="number" name="mouvementsN" value={String(rel.mouvementsN)} onChange={e => handleRelationsBancairesChange(entIndex, relIndex, 'mouvementsN', e.target.value)} readOnly={isReadOnly}/></FormCell>
                                        <FormCell colSpan={1}><InputField type="number" name="incidents" value={String(rel.incidents)} onChange={e => handleRelationsBancairesChange(entIndex, relIndex, 'incidents', e.target.value)} readOnly={isReadOnly}/></FormCell>
                                        <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRelationBancaire(entIndex, relIndex)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                                    </React.Fragment>
                                ))}
                                {!isReadOnly && <FormCell colSpan={12}><ActionButton onClick={() => addRelationBancaire(entIndex)} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter</ActionButton></FormCell>}
                                
                                <FormCell colSpan={7} isHeader>TOTAL</FormCell>
                                <FormCell colSpan={1} isHeader>{totalSolde.toLocaleString()}</FormCell>
                                <FormCell colSpan={1} isHeader>{totalMvtsN1.toLocaleString()}</FormCell>
                                <FormCell colSpan={1} isHeader>{totalMvtsN.toLocaleString()}</FormCell>
                                <FormCell colSpan={1} isHeader>{totalIncidents.toLocaleString()}</FormCell>
                                <FormCell colSpan={1} isHeader>{''}</FormCell>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Historique des crédits */}
            <div className="mb-2 border-t-2 border-gray-400">
                <FormCell colSpan={24} isTitle>Historique des crédits</FormCell>
                <div className="grid grid-cols-24 gap-0">
                    <FormCell colSpan={3} isHeader>Nom Entrepreneur</FormCell>
                    <FormCell colSpan={3} isHeader>Banque</FormCell>
                    <FormCell colSpan={2} isHeader>Date octroi</FormCell>
                    <FormCell colSpan={3} isHeader>Objet / Type</FormCell>
                    <FormCell colSpan={2} isHeader>Montant</FormCell>
                    <FormCell colSpan={1} isHeader>Durée</FormCell>
                    <FormCell colSpan={2} isHeader>Mt Echéance</FormCell>
                    <FormCell colSpan={2} isHeader>Encours</FormCell>
                    <FormCell colSpan={2} isHeader>Impayés</FormCell>
                    <FormCell colSpan={3} isHeader>Renseignements</FormCell>
                    <FormCell colSpan={1} isHeader>Act.</FormCell>
                    {formData.historiqueCredits.map((credit, index) => (
                        <React.Fragment key={credit.id}>
                            <FormCell colSpan={3}><InputField name="nomEntrepreneur" value={credit.nomEntrepreneur} onChange={e => handleNestedChange<HistoriqueCredit>('historiqueCredits', index, 'nomEntrepreneur', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={3}><InputField name="banque" value={credit.banque} onChange={e => handleNestedChange<HistoriqueCredit>('historiqueCredits', index, 'banque', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField type="date" name="dateOctroi" value={credit.dateOctroi} onChange={e => handleNestedChange<HistoriqueCredit>('historiqueCredits', index, 'dateOctroi', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={3}><InputField name="objetType" value={credit.objetType} onChange={e => handleNestedChange<HistoriqueCredit>('historiqueCredits', index, 'objetType', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField type="number" name="montant" value={String(credit.montant)} onChange={e => handleNestedChange<HistoriqueCredit>('historiqueCredits', index, 'montant', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={1}><InputField type="number" name="dureeMois" value={String(credit.dureeMois)} onChange={e => handleNestedChange<HistoriqueCredit>('historiqueCredits', index, 'dureeMois', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField type="number" name="mtEcheance" value={String(credit.mtEcheance)} onChange={e => handleNestedChange<HistoriqueCredit>('historiqueCredits', index, 'mtEcheance', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField type="number" name="encours" value={String(credit.encours)} onChange={e => handleNestedChange<HistoriqueCredit>('historiqueCredits', index, 'encours', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField type="number" name="impayes" value={String(credit.impayes)} onChange={e => handleNestedChange<HistoriqueCredit>('historiqueCredits', index, 'impayes', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={3}><InputField name="renseignements" value={credit.renseignements} onChange={e => handleNestedChange<HistoriqueCredit>('historiqueCredits', index, 'renseignements', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('historiqueCredits', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                        </React.Fragment>
                    ))}
                    {!isReadOnly && <FormCell colSpan={24}><ActionButton onClick={() => addRow<HistoriqueCredit>('historiqueCredits', newHistoriqueCreditTemplate)} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter</ActionButton></FormCell>}
                </div>
            </div>

            {/* Autres affaires détenues par les entrepreneurs */}
            <div className="mb-2 border-t-2 border-gray-400">
                <FormCell colSpan={24} isTitle>Autres affaires détenues par les entrepreneurs</FormCell>
                <div className="grid grid-cols-24 gap-0">
                    <FormCell colSpan={4} isHeader>Dénomination</FormCell>
                    <FormCell colSpan={2} isHeader>Capital</FormCell>
                    <FormCell colSpan={2} isHeader>% Part Entrepreneur</FormCell>
                    <FormCell colSpan={4} isHeader>Nom et prénom</FormCell>
                    <FormCell colSpan={4} isHeader>Activité</FormCell>
                    <FormCell colSpan={3} isHeader>Chiffre d'Affaires</FormCell>
                    <FormCell colSpan={4} isHeader>Banque</FormCell>
                    <FormCell colSpan={1} isHeader>Act.</FormCell>
                    {formData.autresAffaires.map((affaire, index) => (
                        <React.Fragment key={affaire.id}>
                            <FormCell colSpan={4}><InputField name="denomination" value={affaire.denomination} onChange={e => handleNestedChange<AutreAffaire>('autresAffaires', index, 'denomination', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField type="number" name="capital" value={String(affaire.capital)} onChange={e => handleNestedChange<AutreAffaire>('autresAffaires', index, 'capital', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField type="number" name="partEntrepreneur" value={String(affaire.partEntrepreneur)} onChange={e => handleNestedChange<AutreAffaire>('autresAffaires', index, 'partEntrepreneur', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={4}><InputField name="nomPrenom" value={affaire.nomPrenom} onChange={e => handleNestedChange<AutreAffaire>('autresAffaires', index, 'nomPrenom', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={4}><InputField name="activite" value={affaire.activite} onChange={e => handleNestedChange<AutreAffaire>('autresAffaires', index, 'activite', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={3}><InputField type="number" name="chiffreAffaires" value={String(affaire.chiffreAffaires)} onChange={e => handleNestedChange<AutreAffaire>('autresAffaires', index, 'chiffreAffaires', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={4}><InputField name="banque" value={affaire.banque} onChange={e => handleNestedChange<AutreAffaire>('autresAffaires', index, 'banque', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('autresAffaires', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                        </React.Fragment>
                    ))}
                    {!isReadOnly && <FormCell colSpan={24}><ActionButton onClick={() => addRow<AutreAffaire>('autresAffaires', newAutreAffaireTemplate)} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter</ActionButton></FormCell>}
                </div>
            </div>

            {/* Surface Patrimoniale */}
            <div className="mb-4 border-t-2 border-gray-400">
                <FormCell colSpan={24} isTitle>Surface Patrimoniale</FormCell>
                <div className="grid grid-cols-24 gap-0">
                    <FormCell colSpan={4} isHeader>Entrepreneur</FormCell>
                    <FormCell colSpan={2} isHeader>% Part</FormCell>
                    <FormCell colSpan={3} isHeader>Bien</FormCell>
                    <FormCell colSpan={4} isHeader>Référence</FormCell>
                    <FormCell colSpan={5} isHeader>Consistance</FormCell>
                    <FormCell colSpan={2} isHeader>Val. Vénale</FormCell>
                    <FormCell colSpan={3} isHeader>Capital restant dû</FormCell>
                    <FormCell colSpan={1} isHeader>Act.</FormCell>
                     {formData.surfacePatrimoniale.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <FormCell colSpan={4}><InputField name="entrepreneur" value={item.entrepreneur} onChange={e => handleNestedChange<SurfacePatrimonialeItem>('surfacePatrimoniale', index, 'entrepreneur', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField type="number" name="part" value={String(item.part)} onChange={e => handleNestedChange<SurfacePatrimonialeItem>('surfacePatrimoniale', index, 'part', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={3}><SelectField name="bien" value={item.bien} options={typeBienOptions} onChange={e => handleNestedChange<SurfacePatrimonialeItem>('surfacePatrimoniale', index, 'bien', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={4}><InputField name="reference" value={item.reference} onChange={e => handleNestedChange<SurfacePatrimonialeItem>('surfacePatrimoniale', index, 'reference', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={5}><InputField name="consistance" value={item.consistance} onChange={e => handleNestedChange<SurfacePatrimonialeItem>('surfacePatrimoniale', index, 'consistance', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2}><InputField type="number" name="valVenale" value={String(item.valVenale)} onChange={e => handleNestedChange<SurfacePatrimonialeItem>('surfacePatrimoniale', index, 'valVenale', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={3}><InputField type="number" name="capitalRestantDu" value={String(item.capitalRestantDu)} onChange={e => handleNestedChange<SurfacePatrimonialeItem>('surfacePatrimoniale', index, 'capitalRestantDu', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('surfacePatrimoniale', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                        </React.Fragment>
                    ))}
                    {!isReadOnly && <FormCell colSpan={24}><ActionButton onClick={() => addRow<SurfacePatrimonialeItem>('surfacePatrimoniale', newSurfacePatrimonialeItemTemplate)} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter</ActionButton></FormCell>}
                </div>
            </div>

            {/* Synthese */}
            <div className="mb-4 border-t-2 border-gray-400">
                <FormCell colSpan={24} isTitle>Synthèse : opinion de l'Agence sur les entrepreneurs</FormCell>
                <FormCell colSpan={24}><TextAreaField rows={4} name="syntheseEntrepreneur" value={formData.syntheseEntrepreneur} onChange={e => setFormData(prev => ({...prev, syntheseEntrepreneur: e.target.value}))} readOnly={isReadOnly}/></FormCell>
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

export default EntrepreneursPage;