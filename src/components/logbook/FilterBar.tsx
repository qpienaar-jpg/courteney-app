"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { SYMPTOM_CATEGORIES, BODY_AREAS, FREQUENCY_OPTIONS } from "@/lib/ai/symptom-categories";

interface FilterBarProps {
  onFiltersChange: (filters: Record<string, string>) => void;
}

export function FilterBar({ onFiltersChange }: FilterBarProps) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [bodyArea, setBodyArea] = useState("");
  const [minSeverity, setMinSeverity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const buildFilters = useCallback(
    (overrides: Record<string, string> = {}) => {
      const filters: Record<string, string> = {};
      const values = {
        keyword,
        category,
        bodyArea,
        minSeverity,
        startDate,
        endDate,
        ...overrides,
      };
      Object.entries(values).forEach(([k, v]) => {
        if (v) filters[k] = v;
      });
      return filters;
    },
    [keyword, category, bodyArea, minSeverity, startDate, endDate]
  );

  const updateFilter = (key: string, value: string) => {
    const setters: Record<string, (v: string) => void> = {
      keyword: setKeyword,
      category: setCategory,
      bodyArea: setBodyArea,
      minSeverity: setMinSeverity,
      startDate: setStartDate,
      endDate: setEndDate,
    };
    setters[key]?.(value);
    onFiltersChange(buildFilters({ [key]: value }));
  };

  const clearAll = () => {
    setKeyword("");
    setCategory("");
    setBodyArea("");
    setMinSeverity("");
    setStartDate("");
    setEndDate("");
    onFiltersChange({});
  };

  const hasFilters = keyword || category || bodyArea || minSeverity || startDate || endDate;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search symptoms..."
          value={keyword}
          onChange={(e) => updateFilter("keyword", e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-courteney-purple-400 focus:ring-1 focus:ring-courteney-purple-400"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        <select
          value={category}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="px-3 py-1.5 rounded-full border border-gray-200 text-sm bg-white focus:outline-none focus:border-courteney-purple-400"
        >
          <option value="">All categories</option>
          {Object.entries(SYMPTOM_CATEGORIES).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>

        <select
          value={bodyArea}
          onChange={(e) => updateFilter("bodyArea", e.target.value)}
          className="px-3 py-1.5 rounded-full border border-gray-200 text-sm bg-white focus:outline-none focus:border-courteney-purple-400"
        >
          <option value="">All body areas</option>
          {Object.entries(BODY_AREAS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={minSeverity}
          onChange={(e) => updateFilter("minSeverity", e.target.value)}
          className="px-3 py-1.5 rounded-full border border-gray-200 text-sm bg-white focus:outline-none focus:border-courteney-purple-400"
        >
          <option value="">Any severity</option>
          <option value="1">1+ (Mild)</option>
          <option value="4">4+ (Moderate)</option>
          <option value="7">7+ (Severe)</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => updateFilter("startDate", e.target.value)}
          className="px-3 py-1.5 rounded-full border border-gray-200 text-sm bg-white focus:outline-none focus:border-courteney-purple-400"
          placeholder="From"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => updateFilter("endDate", e.target.value)}
          className="px-3 py-1.5 rounded-full border border-gray-200 text-sm bg-white focus:outline-none focus:border-courteney-purple-400"
          placeholder="To"
        />

        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
