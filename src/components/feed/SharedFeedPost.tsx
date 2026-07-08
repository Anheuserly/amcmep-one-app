"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchFeedPost, toFeedPost } from "@/lib/services/appwriteServices";
import { formatRelative } from "@/lib/utils";
import type { FeedPost } from "@/types";
import { ArrowLeft, ExternalLink, MessageCircle, Repeat, Share2 } from "lucide-react";
import toast from "react-hot-toast";

function postShareUrl(postId: string) {
  if (typeof window === "undefined") return `https://app.amcmep.in/p/${postId}`;
  return `${window.location.origin}/p/${postId}`;
}

export function SharedFeedPost() {
  const router = useRouter();
  const params = useParams<{ postId: string }>();
  const postId = Array.isArray(params.postId) ? params.postId[0] : params.postId;
  const [post, setPost] = useState<FeedPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function loadPost() {
      if (!postId) return;
      setIsLoading(true);
      try {
        const doc = await fetchFeedPost(postId);
        if (alive) setPost(toFeedPost(doc));
      } catch {
        if (alive) setPost(null);
      } finally {
        if (alive) setIsLoading(false);
      }
    }
    loadPost();
    return () => {
      alive = false;
    };
  }, [postId]);

  const shareUrl = useMemo(() => postShareUrl(postId || ""), [postId]);

  const sharePost = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "AMC MEP 24x7 update",
          text: post?.content || "AMC MEP 24x7 update",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Post link copied");
      }
    } catch {}
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
          Home
        </Button>
        <Button variant="outline" onClick={sharePost}>
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-gray-500">Loading post...</CardContent>
        </Card>
      ) : !post ? (
        <EmptyState
          icon={<MessageCircle className="h-12 w-12" />}
          title="Post not available"
          description="This update may have been removed or the link is no longer active."
          action={
            <Button onClick={() => router.push("/")}>
              Open home
              <ExternalLink className="h-4 w-4" />
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <Avatar src={post.authorAvatar} name={post.authorName} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-950">{post.authorName}</p>
                <p className="text-xs text-slate-400">{formatRelative(post.createdAt)}</p>
              </div>
            </div>

            {post.content && <p className="whitespace-pre-wrap text-sm leading-6 text-slate-800">{post.content}</p>}

            {post.mediaUrls.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                {post.mediaType === "video" || post.mediaUrls[0]?.match(/\.(mp4|mov|webm|mkv)(\?|$)/i) ? (
                  <video src={post.mediaUrls[0]} controls playsInline className="max-h-[70vh] w-full bg-slate-950" />
                ) : (
                  <img src={post.mediaUrls[0]} alt="" className="max-h-[70vh] w-full object-contain" />
                )}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500">
              <span>{post.likes} likes</span>
              <span>{post.commentsCount} comments</span>
              <span className="inline-flex items-center gap-1"><Repeat className="h-4 w-4" /> {post.reposts} reposts</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button onClick={() => router.push("/login")}>Sign in to interact</Button>
              <Button variant="outline" onClick={() => router.push("/")}>Open home feed</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
