"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelative } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Heart, MessageCircle, Repeat, Share, Image, Send, X, MoreHorizontal, ThumbsUp
} from "lucide-react";
import type { FeedPost, FeedComment, UserRole } from "@/types";

const roleBadgeColors: Record<UserRole, string> = {
  customer: "bg-green-100 text-green-700",
  partner: "bg-blue-100 text-blue-700",
  vendor: "bg-purple-100 text-purple-700",
  administrator: "bg-red-100 text-red-700",
  guest: "bg-gray-100 text-gray-600",
};

const mockComments: FeedComment[] = [
  { $id: "c1", postId: "1", authorId: "user2", authorName: "Rahul Kumar", authorAvatar: "", content: "Great service! Would recommend.", likes: 3, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { $id: "c2", postId: "1", authorId: "user3", authorName: "Vikram Singh", authorAvatar: "", content: "Thanks for sharing this update.", likes: 1, createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { $id: "c3", postId: "2", authorId: "user1", authorName: "John Doe", authorAvatar: "", content: "When is the next workshop?", likes: 2, createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
];

const mockPosts: FeedPost[] = [
  { $id: "1", authorId: "biz1", authorName: "Shree Ganesh Enterprises", authorAvatar: "", authorRole: "administrator", content: "🔥 Fire Safety Awareness Week starts Monday! Join us for free safety inspections at your workplace. Book your slot now through our app. #FireSafety #AMC #WorkplaceSafety", mediaUrls: [], mediaType: undefined, likes: 24, commentsCount: 2, reposts: 5, isLiked: false, isReposted: false, tags: ["FireSafety", "AMC", "WorkplaceSafety"], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { $id: "2", authorId: "user2", authorName: "Rahul Kumar", authorAvatar: "", authorRole: "partner", content: "Just completed a full HVAC installation at Tech Park. The new VRF system is running beautifully! 💨❄️ #HVAC #Installation #Cooling", mediaUrls: [""], mediaType: "image", likes: 56, commentsCount: 1, reposts: 12, isLiked: true, isReposted: false, tags: ["HVAC", "Installation", "Cooling"], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { $id: "3", authorId: "biz2", authorName: "Agni Fire Safety", authorAvatar: "", authorRole: "administrator", content: "⚠️ Important: Fire extinguisher refill reminders are now automated. Check your AMC dashboard for upcoming maintenance dates. Don't miss your safety compliance!", mediaUrls: [], mediaType: undefined, likes: 18, commentsCount: 0, reposts: 8, isLiked: false, isReposted: false, tags: ["FireSafety", "Compliance"], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { $id: "4", authorId: "user3", authorName: "Vikram Singh", authorAvatar: "", authorRole: "partner", content: "Looking for qualified electricians in Bangalore for a large commercial project. DM me if interested! Must have MEP certification. #Hiring #Electrician #Bangalore", mediaUrls: [], mediaType: undefined, likes: 32, commentsCount: 0, reposts: 15, isLiked: false, isReposted: true, tags: ["Hiring", "Electrician", "Bangalore"], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
  { $id: "5", authorId: "user1", authorName: "John Doe", authorAvatar: "", authorRole: "customer", content: "Had my annual fire safety inspection done today. Very professional team from Agni Fire Safety. All equipment certified and ready! 🔥✅ #CustomerReview #FireSafety", mediaUrls: [], mediaType: undefined, likes: 12, commentsCount: 0, reposts: 2, isLiked: false, isReposted: false, tags: ["CustomerReview", "FireSafety"], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { $id: "6", authorId: "biz3", authorName: "CoolAir HVAC", authorAvatar: "", authorRole: "administrator", content: "Summer is coming! 🌞 Get your AC units serviced before the heat wave hits. Book AMC packages at 20% off this month. Offer valid till March 31st! #HVAC #SummerReady #Discount", mediaUrls: ["", ""], mediaType: "image", likes: 89, commentsCount: 0, reposts: 22, isLiked: true, isReposted: false, tags: ["HVAC", "SummerReady", "Discount"], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString() },
  { $id: "7", authorId: "user4", authorName: "Priya Sharma", authorAvatar: "", authorRole: "customer", content: "Just renewed my DG set AMC. Peace of mind for another year! The PowerGen team is always punctual and thorough. 💪 #DieselGenerator #AMC #Reliable", mediaUrls: [], mediaType: undefined, likes: 15, commentsCount: 0, reposts: 3, isLiked: false, isReposted: false, tags: ["DieselGenerator", "AMC", "Reliable"], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { $id: "8", authorId: "biz4", authorName: "FlowPro Plumbing", authorAvatar: "", authorRole: "administrator", content: "💧 Leak detection tip: If your water bill suddenly spikes, you might have an underground leak. Our team uses advanced acoustic sensors to pinpoint leaks without breaking walls. #Plumbing #LeakDetection #SmartTechnology", mediaUrls: [], mediaType: undefined, likes: 42, commentsCount: 0, reposts: 9, isLiked: false, isReposted: false, tags: ["Plumbing", "LeakDetection", "SmartTechnology"], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
];

export default function FeedPage() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>(mockPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    const post: FeedPost = {
      $id: `new-${Date.now()}`,
      authorId: profile?.userId || "user1",
      authorName: profile?.name || "User",
      authorAvatar: profile?.avatar,
      authorRole: (profile?.activeRole as UserRole) || "customer",
      content: newPostContent.trim(),
      mediaUrls: [],
      mediaType: undefined,
      likes: 0,
      commentsCount: 0,
      reposts: 0,
      isLiked: false,
      isReposted: false,
      tags: [],
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [post, ...prev]);
    setNewPostContent("");
    setShowComposer(false);
    toast.success("Post published!");
  };

  const toggleLike = (postId: string) => {
    setPosts((prev) => prev.map((p) => p.$id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const toggleRepost = (postId: string) => {
    setPosts((prev) => prev.map((p) => p.$id === postId ? { ...p, isReposted: !p.isReposted, reposts: p.isReposted ? p.reposts - 1 : p.reposts + 1 } : p));
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => { const next = new Set(prev); next.has(postId) ? next.delete(postId) : next.add(postId); return next; });
  };

  const addComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts((prev) => prev.map((p) => p.$id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    toast.success("Comment added!");
  };

  const postComments = (postId: string) => mockComments.filter((c) => c.postId === postId);

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
          <p className="text-gray-500 mt-1">Updates from the AMC MEP community</p>
        </div>
      </div>

      {/* Post Composer */}
      <Card>
        <CardContent className="p-4">
          {!showComposer ? (
            <button onClick={() => setShowComposer(true)} className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 transition-colors">
              What's happening in your workspace?
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's happening in your workspace?"
                className="w-full h-24 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                  <Image className="h-5 w-5" />
                </button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowComposer(false)}>Cancel</Button>
                  <Button size="sm" onClick={handlePost} disabled={!newPostContent.trim()}>
                    <Send className="h-4 w-4 mr-2" />Post
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <EmptyState icon={<MessageCircle className="h-12 w-12" />} title="No posts yet" description="Be the first to share an update!" />
        ) : (
          posts.map((post) => (
            <Card key={post.$id} className="overflow-hidden">
              <CardContent className="p-4">
                {/* Author */}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar src={post.authorAvatar} name={post.authorName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-900">{post.authorName}</p>
                      <Badge className={roleBadgeColors[post.authorRole]}>{post.authorRole}</Badge>
                    </div>
                    <p className="text-xs text-gray-400">{formatRelative(post.createdAt)}</p>
                  </div>
                  <button className="p-1 text-gray-400 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>
                )}

                {/* Media Placeholders */}
                {post.mediaUrls.length > 0 && (
                  <div className={`grid gap-2 mt-3 ${post.mediaUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                    {post.mediaUrls.map((_, i) => (
                      <div key={i} className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <Image className="h-8 w-8 text-gray-300" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => toggleLike(post.$id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${post.isLiked ? "text-red-600 bg-red-50" : "text-gray-500 hover:bg-gray-50"}`}>
                    <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button onClick={() => toggleComments(post.$id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.commentsCount}</span>
                  </button>
                  <button onClick={() => toggleRepost(post.$id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${post.isReposted ? "text-green-600 bg-green-50" : "text-gray-500 hover:bg-gray-50"}`}>
                    <Repeat className="h-4 w-4" />
                    <span>{post.reposts}</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors ml-auto">
                    <Share className="h-4 w-4" />
                  </button>
                </div>

                {/* Comments */}
                {expandedComments.has(post.$id) && (
                  <div className="mt-3 space-y-3">
                    {postComments(post.$id).map((comment) => (
                      <div key={comment.$id} className="flex gap-2">
                        <Avatar src={comment.authorAvatar} name={comment.authorName} size="sm" />
                        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                          <p className="text-xs font-semibold text-gray-900">{comment.authorName}</p>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatRelative(comment.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Avatar src={profile?.avatar} name={profile?.name || "You"} size="sm" />
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInputs[post.$id] || ""}
                          onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.$id]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && addComment(post.$id)}
                          className="flex-1 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        <Button size="sm" onClick={() => addComment(post.$id)} disabled={!commentInputs[post.$id]?.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
