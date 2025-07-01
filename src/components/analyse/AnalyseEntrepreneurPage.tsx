
import React from 'react';
import { CreditApplicationData, AnalyseData } from '../../types.ts';
import { analysisConfig } from './analysisConfig.ts';
import RiskFactorRow from './RiskFactorRow.tsx';

interface AnalyseEntrepreneurPageProps {
    formData: CreditApplicationData;
    setFormData: (updateFn: (prev: CreditApplicationData) => CreditApplicationData) => void;
    onNext: () => void;
}

const AnalyseEntrepreneurPage: React.FC<AnalyseEntrepreneurPageProps> = ({ formData, setFormData, onNext }) => {
    const sectionKey: keyof AnalyseData = 'entrepreneur';
    const config = analysisConfig[sectionKey];
    const data = formData.analysis[sectionKey];

    const handleSelectionChange = (factorKey: string, selectionIndex: number) => {
        setFormData(prev => {
            const newAnalysis = { ...prev.analysis };
            const factorConfig = config.factors[factorKey];
            const selectionValue = factorConfig.options[selectionIndex]?.value ?? 0;
            const score = (selectionValue / 100) * factorConfig.ponderation;
            
            newAnalysis[sectionKey][factorKey] = {
                selection: selectionIndex,
                score: score,
            };
            
            return { ...prev, analysis: newAnalysis };
        });
    };

    const totalScore = Object.keys(data).reduce((sum, key) => sum + (data[key]?.score ?? 0), 0);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">{config.title}</h2>
            <div className="grid grid-cols-12 border border-gray-300 rounded-lg text-xs">
                {/* Headers */}
                <div className="col-span-1 p-2 font-bold bg-gray-100 border-b border-gray-300">N°</div>
                <div className="col-span-5 p-2 font-bold bg-gray-100 border-b border-gray-300">Facteurs endémiques de risque</div>
                <div className="col-span-2 p-2 font-bold bg-gray-100 border-b border-gray-300 text-center">Analyse à réaliser</div>
                <div className="col-span-2 p-2 font-bold bg-gray-100 border-b border-gray-300 text-center">Sélection</div>
                <div className="col-span-1 p-2 font-bold bg-gray-100 border-b border-gray-300 text-center">Score</div>
                <div className="col-span-1 p-2 font-bold bg-gray-100 border-b border-gray-300 text-center">Poids</div>
                
                {/* Body */}
                {Object.keys(config.factors).map(key => (
                    <RiskFactorRow 
                        key={key}
                        factorKey={key}
                        factor={{ ...config.factors[key], ...data[key] }}
                        onSelectionChange={handleSelectionChange}
                    />
                ))}
                
                {/* Footer */}
                <div className="col-span-9 p-2 font-bold bg-gray-100 border-t border-gray-300 text-right">SCORE TOTAL ({config.totalPonderation} Facteurs de risques)</div>
                <div className="col-span-1 p-2 font-bold bg-gray-200 border-t border-gray-300 text-center">{totalScore.toFixed(2)}%</div>
                <div className="col-span-2 p-2 font-bold bg-gray-100 border-t border-gray-300 text-center">{config.totalPonderation}%</div>
            </div>
            <div className="flex justify-end mt-6">
                <button onClick={onNext} className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700">
                    Suivant &rarr;
                </button>
            </div>
        </div>
    );
};

export default AnalyseEntrepreneurPage;
