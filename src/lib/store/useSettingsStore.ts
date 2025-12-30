import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    chartVisibility: {
        campaignStatus: boolean;
        platformBreakdown: boolean;
        conversionFunnel: boolean;
        budgetUtilization: boolean;
        performanceComparison: boolean;
    };
    toggleChart: (key: keyof SettingsState['chartVisibility']) => void;
    setChartVisibility: (key: keyof SettingsState['chartVisibility'], isVisible: boolean) => void;
    resetSettings: () => void;
}

const defaultSettings = {
    campaignStatus: true,
    platformBreakdown: true,
    conversionFunnel: true,
    budgetUtilization: true,
    performanceComparison: true,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            chartVisibility: defaultSettings,
            toggleChart: (key) =>
                set((state) => ({
                    chartVisibility: {
                        ...state.chartVisibility,
                        [key]: !state.chartVisibility[key],
                    },
                })),
            setChartVisibility: (key, isVisible) =>
                set((state) => ({
                    chartVisibility: {
                        ...state.chartVisibility,
                        [key]: isVisible,
                    },
                })),
            resetSettings: () =>
                set({
                    chartVisibility: defaultSettings,
                }),
        }),
        {
            name: 'mixo-settings-storage',
        }
    )
);
