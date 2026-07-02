"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import {
  ShoppingCart, Search, Filter, Tag, MapPin, MessageCircle, Store, Star, Heart, X, ArrowRight, IndianRupee
} from "lucide-react";
import type { MarketplaceItem } from "@/types";

const categories = ["All", "Equipment", "Parts", "Tools", "Safety", "Services"];

const mockItems: MarketplaceItem[] = [
  { $id: "1", title: "Fire Extinguisher ABC 6kg", description: "ABC type dry powder fire extinguisher, ISI certified, 6kg capacity", price: 3200, currency: "INR", category: "Safety", images: [""], condition: "new", sellerId: "biz2", sellerName: "Agni Fire Safety", sellerBusinessId: "biz2", status: "active", location: "Bangalore", createdAt: "2024-01-15" },
  { $id: "2", title: "HVAC Copper Pipe 3/4 inch", description: "Refrigeration grade copper pipe, 3/4 inch diameter, 50m coil", price: 8500, currency: "INR", category: "Parts", images: [""], condition: "new", sellerId: "biz3", sellerName: "CoolAir HVAC", sellerBusinessId: "biz3", status: "active", location: "Bangalore", createdAt: "2024-02-10" },
  { $id: "3", title: "Digital Multimeter Fluke 117", description: "Professional electrician multimeter, true RMS, backlit display", price: 12000, currency: "INR", category: "Tools", images: [""], condition: "new", sellerId: "user3", sellerName: "Vikram Singh", sellerBusinessId: undefined, status: "active", location: "Bangalore", createdAt: "2024-02-20" },
  { $id: "4", title: "Diesel Generator 62.5kVA", description: "Kirloskar 62.5kVA DG set, 3 phase, low hours, excellent condition", price: 450000, currency: "INR", category: "Equipment", images: ["", ""], condition: "refurbished", sellerId: "biz5", sellerName: "PowerGen Services", sellerBusinessId: "biz5", status: "active", location: "Bangalore", createdAt: "2024-03-01" },
  { $id: "5", title: "Smoke Detector Addressable", description: "Honeywell addressable smoke detector with base, brand new", price: 1800, currency: "INR", category: "Safety", images: [""], condition: "new", sellerId: "biz2", sellerName: "Agni Fire Safety", sellerBusinessId: "biz2", status: "active", location: "Bangalore", createdAt: "2024-03-05" },
  { $id: "6", title: "Pipe Wrench Set 14-24 inch", description: "Heavy duty pipe wrench set, 3 pieces, used but good condition", price: 2500, currency: "INR", category: "Tools", images: [""], condition: "used", sellerId: "user2", sellerName: "Rahul Kumar", sellerBusinessId: undefined, status: "active", location: "Bangalore", createdAt: "2024-03-10" },
  { $id: "7", title: "Chiller Unit 10TR", description: "Carrier 10 ton air cooled chiller, recently serviced, working condition", price: 280000, currency: "INR", category: "Equipment", images: [""], condition: "refurbished", sellerId: "biz3", sellerName: "CoolAir HVAC", sellerBusinessId: "biz3", status: "active", location: "Bangalore", createdAt: "2024-03-15" },
  { $id: "8", title: "Emergency Exit Sign LED", description: "Double sided LED exit sign with battery backup, green", price: 950, currency: "INR", category: "Safety", images: [""], condition: "new", sellerId: "biz2", sellerName: "Agni Fire Safety", sellerBusinessId: "biz2", status: "active", location: "Bangalore", createdAt: "2024-03-18" },
  { $id: "9", title: "Plumbing Service - Leak Repair", description: "Professional leak detection and repair service, 1 year warranty", price: 1500, currency: "INR", category: "Services", images: [], condition: "new", sellerId: "biz4", sellerName: "FlowPro Plumbing", sellerBusinessId: "biz4", status: "active", location: "Bangalore", createdAt: "2024-03-20" },
  { $id: "10", title: "Cable Tray 300x50mm", description: "GI perforated cable tray, 3m length, 50mm depth, powder coated", price: 1200, currency: "INR", category: "Parts", images: [""], condition: "new", sellerId: "biz6", sellerName: "VoltTech Solutions", sellerBusinessId: "biz6", status: "active", location: "Bangalore", createdAt: "2024-03-22" },
  { $id: "11", title: "Pressure Gauge 0-10 bar", description: "Wika pressure gauge, 4 inch dial, bottom connection, brand new", price: 1800, currency: "INR", category: "Parts", images: [""], condition: "new", sellerId: "user4", sellerName: "Priya Sharma", sellerBusinessId: undefined, status: "active", location: "Bangalore", createdAt: "2024-03-25" },
  { $id: "12", title: "Safety Helmet ISI Marked", description: "Yellow HDPE safety helmet, adjustable, ISI certified, pack of 5", price: 1500, currency: "INR", category: "Safety", images: [""], condition: "new", sellerId: "biz2", sellerName: "Agni Fire Safety", sellerBusinessId: "biz2", status: "active", location: "Bangalore", createdAt: "2024-03-28" },
];

const conditionColors = { new: "bg-green-100 text-green-700", used: "bg-yellow-100 text-yellow-700", refurbished: "bg-blue-100 text-blue-700" };

export default function MarketplacePage() {
  const { activeRole } = useAuth();
  const [items] = useState<MarketplaceItem[]>(mockItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

  const filtered = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContact = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setShowContactModal(true);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-500 mt-1">Equipment, parts, tools, and services</p>
        </div>
        {(activeRole === "partner" || activeRole === "administrator") && (
          <Button><Store className="h-4 w-4 mr-2" />My Listings</Button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" placeholder="Search marketplace..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${selectedCategory === cat ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full"><EmptyState icon={<ShoppingCart className="h-12 w-12" />} title="No items found" description="Try adjusting your search or category filter" /></div>
        ) : (
          filtered.map((item) => (
            <Card key={item.$id} className="overflow-hidden hover:shadow-md transition-shadow">
              {/* Image Placeholder */}
              <div className="h-40 bg-gray-100 flex items-center justify-center border-b border-gray-100">
                {item.images.length > 0 ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50"><Tag className="h-10 w-10 text-gray-300" /></div>
                ) : (
                  <div className="text-center"><Store className="h-10 w-10 text-gray-300 mx-auto mb-2" /><p className="text-xs text-gray-400">Service</p></div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  <Badge className={conditionColors[item.condition]}>{item.condition}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-gray-400">{item.currency}</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{item.location}</span>
                  <span className="mx-1">•</span>
                  <span>{item.sellerName}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1" onClick={() => handleContact(item)}><MessageCircle className="h-4 w-4 mr-1" />Contact</Button>
                  <Button size="sm" variant="outline" className="px-2"><Heart className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b"><h2 className="text-lg font-bold">Contact Seller</h2><button onClick={() => setShowContactModal(false)}><X className="h-5 w-5" /></button></div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center"><Store className="h-6 w-6 text-gray-400" /></div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedItem.title}</p>
                  <p className="text-sm text-gray-500">₹{selectedItem.price.toLocaleString("en-IN")} • {selectedItem.sellerName}</p>
                </div>
              </div>
              <textarea className="w-full h-24 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Hi, I'm interested in this item. Is it still available?" defaultValue={`Hi, I'm interested in "${selectedItem.title}". Is it still available?`} />
              <div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setShowContactModal(false)}>Cancel</Button><Button className="flex-1" onClick={() => { toast.success("Message sent to seller!"); setShowContactModal(false); }}><MessageCircle className="h-4 w-4 mr-2" />Send Message</Button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
