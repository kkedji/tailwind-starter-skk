

import React from 'react';
import { CreditApplicationData } from '../types.ts';
import { generateSynthesis } from "../lib/gemini";
import { useState } from "react";

interface SynthesePageProps {
  formData: CreditApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
  onNext: () => void;
  isReadOnly?: boolean;
}

const FormCell = ({ children, className = '', colSpan = 1, rowSpan = 1, isHeader = false, isTitle = false, align = 'center' }: { children: any, className?: string, colSpan?: number, rowSpan?: number, isHeader?: boolean, isTitle?: boolean, align?: string }) => {
    const baseClasses = 'border border-black p-1 text-sm flex items-center';
    const bgClasses = isTitle ? 'bg-gray-400 font-bold text-white' : isHeader ? 'bg-gray-200 font-semibold' : 'bg-white';
    const alignClasses = `justify-${align}`;
    const style = {
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
    };
    return <div style={style} className={`${baseClasses} ${bgClasses} ${className}`}>{children}</div>;
};

const TextAreaField = ({ value, onChange, name, className = '', rows = 2, readOnly = false }) => (
    <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} readOnly={readOnly} className={`w-full bg-transparent outline-none text-sm p-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} />
);

const InputField = ({ value, onChange, name, type = 'text', readOnly = false }) => (
    <input type={type} name={name} value={value ?? ''} onChange={onChange} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-sm px-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
);

const SynthesePage: React.FC<SynthesePageProps> = ({ formData, setFormData, onNext, isReadOnly = false }) => {
    
    const handleFieldChange = (section: keyof CreditApplicationData | `synthese.${keyof CreditApplicationData['synthese']}` | `entreprise.${keyof CreditApplicationData['entreprise']}` | `activiteMarche.${keyof CreditApplicationData['activiteMarche']}` | `historiqueBancaire.${keyof CreditApplicationData['historiqueBancaire']}` | `ratios.${keyof CreditApplicationData['ratios']}`, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const keys = section.split('.');
            if (keys.length === 1) {
                return { ...prev, [section]: value };
            }
            if (keys.length === 2) {
                const [mainKey, subKey] = keys as [keyof CreditApplicationData, string];
                return { 
                    ...prev, 
                    [mainKey]: {
                        ...(prev[mainKey] as object),
                        [subKey]: value
                    }
                };
            }
            return prev;
        });
    };

    const handlePrint = () => {
        window.print();
    };
    const [syntheseGeneree, setSyntheseGeneree] = useState("");

const handleGenerateSynthesis = async () => {
  const prompt = `Rédige une synthèse claire et professionnelle à destination d’un analyste crédit.

- Affaire : ${formData.affaire}
- Dossier : ${formData.dossier}
- Nom entreprise : ${formData.entreprise.nom}
- Activité : ${formData.activiteMarche.description}
- Historique bancaire : ${formData.historiqueBancaire.commentaires}
- Ratios clés : ${JSON.stringify(formData.ratios)}

Présente un avis neutre, structuré et synthétique.`;

  const texte = await generateSynthesis(prompt);
  setSyntheseGeneree(texte);
};

    return (
        <div className="bg-white p-6 rounded-lg text-sm print-page">
            <div className="grid grid-cols-12 gap-0 mb-4">
                <div className="col-span-4 bg-yellow-400 p-2 border border-black font-bold">Affaire: {formData.affaire}</div>
                <div className="col-span-4"></div>
                <div className="col-span-4 bg-yellow-400 p-2 border border-black font-bold text-right">Dossier: {formData.dossier}</div>
                <div className="col-span-4 bg-gray-200 p-2 border border-black">Date ouverture du dossier</div>
                <div className="col-span-8 bg-gray-200 p-2 border border-black">{new Date(formData.dateOuvertureDossier).toLocaleDateString('fr-FR')}</div>
            </div>

            <div className="grid grid-cols-12 gap-0 mb-4">
                <FormCell colSpan={8} isHeader className="bg-gray-400" align="left">Fiche de synthèse</FormCell>
                <FormCell colSpan={2} isHeader className="bg-gray-200" align="left">Date impression document</FormCell>
                <FormCell colSpan={2} isHeader className="bg-gray-200" align="left">
                    <InputField type="date" name="dateImpression" value={formData.synthese.dateImpression} onChange={e => handleFieldChange('synthese.dateImpression', e.target.value)} readOnly={isReadOnly} />
                </FormCell>
            </div>

            <div className="space-y-2">
                <div className="border border-black">
                    <div className="bg-gray-200 p-2 font-semibold">Entrepreneur</div>
                    <TextAreaField rows={1} name="syntheseEntrepreneur" value={formData.syntheseEntrepreneur} onChange={e => handleFieldChange('syntheseEntrepreneur', e.target.value)} readOnly={isReadOnly}/>
                </div>
                <div className="border border-black">
                    <div className="bg-gray-200 p-2 font-semibold">Entreprise</div>
                    <TextAreaField rows={1} name="syntheseEntreprise" value={formData.entreprise.syntheseEntreprise} onChange={e => handleFieldChange('entreprise.syntheseEntreprise', e.target.value)} readOnly={isReadOnly}/>
                </div>
                <div className="border border-black">
                    <div className="bg-gray-200 p-2 font-semibold">Activité</div>
                     <TextAreaField rows={1} name="syntheseActivite" value={formData.activiteMarche.synthese} onChange={e => handleFieldChange('activiteMarche.synthese', e.target.value)} readOnly={isReadOnly}/>
                </div>
                <div className="border border-black">
                    <div className="bg-gray-200 p-2 font-semibold">Historique bancaire</div>
                    <TextAreaField rows={1} name="syntheseHistorique" value={formData.historiqueBancaire.commentaires} onChange={e => handleFieldChange('historiqueBancaire.commentaires', e.target.value)} readOnly={isReadOnly}/>
                </div>
                <div className="border border-black">
                    <div className="bg-gray-200 p-2 font-semibold">Synthèse financière (Trésorerie / Bilan / CDR / Ratios) <span className="italic font-normal">cf. onglet RATIOS</span></div>
                    <TextAreaField rows={1} name="syntheseFinanciere" value={formData.ratios.syntheseFinanciere} onChange={e => handleFieldChange('ratios.syntheseFinanciere', e.target.value)} readOnly={isReadOnly}/>
                </div>

                <div className="border border-black">
                    <div className="bg-yellow-200 p-2 font-semibold">Commentaires</div>
                    <div className="bg-gray-200 p-2 font-semibold border-t border-black">Chargé de clientèle</div>
                    <TextAreaField rows={1} name="chargeClientele" value={formData.synthese.chargeClientele} onChange={e => handleFieldChange('synthese.chargeClientele', e.target.value)} readOnly={isReadOnly}/>
                </div>
                 <div className="border border-black">
                    <div className="bg-gray-200 p-2 font-semibold">Directeur Agence</div>
                    <TextAreaField rows={1} name="directeurAgence" value={formData.synthese.directeurAgence} onChange={e => handleFieldChange('synthese.directeurAgence', e.target.value)} readOnly={isReadOnly}/>
                </div>
                 <div className="border border-black">
                    <div className="bg-gray-200 p-2 font-semibold">Responsable Engagements</div>
                    <TextAreaField rows={1} name="responsableEngagements" value={formData.synthese.responsableEngagements} onChange={e => handleFieldChange('synthese.responsableEngagements', e.target.value)} readOnly={isReadOnly}/>
                </div>
                    <div className="border border-black">
                  <div className="bg-gray-200 p-2 font-semibold">Comité</div>
                  <TextAreaField
                    rows={1}
                    name="comite"
                    value={formData.synthese.comite}
                    onChange={(e) =>
                      handleFieldChange("synthese.comite", e.target.value)
                    }
                    readOnly={isReadOnly}
                  />
                </div>
              </div>

              {/* 🔘 Bouton pour lancer la génération */}
              {!isReadOnly && (
                <div className="flex justify-end mb-4 hide-on-print">
                  <button
                    type="button"
                    onClick={handleGenerateSynthesis}
                    className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Générer la synthèse automatiquement
                  </button>
                </div>
              )}

              {/* 🧾 Affichage de la synthèse générée */}
              {!isReadOnly && syntheseGeneree && (
                <div className="mt-4 p-4 bg-white border border-gray-300 rounded shadow">
                  <h3 className="text-md font-semibold mb-2">
                    Synthèse générée automatiquement
                  </h3>
                  <p className="whitespace-pre-line text-sm text-gray-700">
                    {syntheseGeneree}
                  </p>
                </div>
              )}

              {/* 🎯 Boutons d’action finaux */}
              <div className="flex justify-between mt-6 hide-on-print">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
                >
                  Imprimer / Exporter en PDF
                </button>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={onNext}
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                  >
                    Enregistrer et Suivant
                  </button>
                )}
              </div>
            </div> {/* ✅ Fermeture propre du dernier div */}
          </div> {/* ✅ Et celle-ci aussi */}
        );
      };

export default SynthesePage;