"use client";

import { useState, useEffect, useCallback } from "react";
import { FilterBar } from "@/components/logbook/FilterBar";
import { SymptomTimeline } from "@/components/logbook/SymptomTimeline";

export default function LogbookPage() {
  const [symptoms, setSymptoms] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchSymptoms = useCallback(
    async (pageNum: number, currentFilters: Record<string, string>, append = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: "20",
          ...currentFilters,
        });
        const res = await fetch(`/api/symptoms?${params}`);
        const data = await res.json();
        setSymptoms((prev) => (append ? [...prev, ...data.symptoms] : data.symptoms));
        setTotal(data.total);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSymptoms(1, filters);
  }, [filters, fetchSymptoms]);

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSymptoms(nextPage, filters, true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold text-gray-900">
          Symptom Logbook
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Your complete symptom history — search, filter, and review
        </p>
      </div>

      <div className="space-y-6">
        <FilterBar onFiltersChange={handleFiltersChange} />
        <SymptomTimeline
          symptoms={symptoms}
          total={total}
          page={page}
          onLoadMore={handleLoadMore}
          loading={loading}
        />
      </div>
    </div>
  );
}
