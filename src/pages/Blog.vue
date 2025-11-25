<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
    getAllPosts,
    getPostBySlug,
    getAllTags,
    formatDate,
} from "@/services/blogService";

const view = ref("list");
const currentPost = ref(null);
const selectedTag = ref(null);
const posts = ref([]);
const tags = ref([]);

const route = useRoute();
const router = useRouter();

const filteredPosts = computed(() => {
    if (!selectedTag.value) return posts.value;
    return posts.value.filter((p) => p.tags.includes(selectedTag.value));
});

const loadPosts = () => {
    posts.value = getAllPosts();
    tags.value = getAllTags();
};

const openPost = (slug) => {
    currentPost.value = getPostBySlug(slug);
    if (currentPost.value) {
        view.value = "post";
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (route.query.post !== slug) {
            router.replace({
                name: "Blog",
                query: { ...route.query, post: slug },
            });
        }
    } else if (route.query.post) {
        const newQuery = { ...route.query };
        delete newQuery.post;
        router.replace({ name: "Blog", query: newQuery });
    }
};

const goBack = ({ skipQueryUpdate = false } = {}) => {
    view.value = "list";
    currentPost.value = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!skipQueryUpdate && "post" in route.query) {
        const newQuery = { ...route.query };
        delete newQuery.post;
        router.replace({ name: "Blog", query: newQuery });
    }
};

const toggleTag = (tag) => {
    selectedTag.value = selectedTag.value === tag ? null : tag;
};

const parseMarkdown = (content) => {
    let html = content;

    html = html.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre class="bg-catppuccin-surface/50 border border-catppuccin-overlay/30 rounded p-4 overflow-x-auto my-4"><code>$2</code></pre>',
    );

    html = html.replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold text-catppuccin-mauve mt-6 mb-3">$1</h3>',
    );
    html = html.replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-semibold text-catppuccin-blue mt-8 mb-4">$1</h2>',
    );
    html = html.replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold text-catppuccin-text mt-8 mb-4">$1</h1>',
    );

    html = html.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-catppuccin-mauve font-semibold">$1</strong>',
    );
    html = html.replace(
        /`([^`]+)`/g,
        '<code class="bg-catppuccin-surface/50 px-2 py-0.5 rounded text-catppuccin-pink text-sm">$1</code>',
    );
    html = html.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" class="text-catppuccin-blue hover:text-catppuccin-mauve underline transition-colors">$1</a>',
    );
    html = html.replace(
        /^\- (.*$)/gim,
        '<li class="ml-6 list-disc text-catppuccin-text mb-1">$1</li>',
    );

    html = html
        .split("\n\n")
        .map((p) => {
            if (!p.trim().startsWith("<")) {
                return `<p class="text-catppuccin-text leading-relaxed mb-4">${p}</p>`;
            }
            return p;
        })
        .join("\n");

    return html;
};

onMounted(() => {
    loadPosts();
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";

    const slugFromQuery = route.query.post;
    if (slugFromQuery) {
        openPost(slugFromQuery);
    }
});

onBeforeUnmount(() => {
    document.documentElement.style.overflowY = "";
    document.body.style.overflowY = "";
});

watch(
    () => route.query.post,
    (slug, prevSlug) => {
        if (slug && slug !== prevSlug) {
            openPost(slug);
        } else if (!slug && view.value === "post") {
            goBack({ skipQueryUpdate: true });
        }
    },
);
</script>

<template>
    <div
        class="w-full min-h-screen h-screen overflow-x-hidden overflow-y-auto font-mono"
    >
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            <Transition name="fade" mode="out-in">
                <div v-if="view === 'list'" key="list">
                    <div class="mb-12">
                        <div class="text-catppuccin-subtle text-sm mb-2">
                            ~$ cd ~/blog
                        </div>
                        <h1
                            class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-4"
                        >
                            <span class="text-catppuccin-mauve">blog</span>
                        </h1>
                        <p
                            class="text-sm text-catppuccin-gray leading-relaxed mb-6"
                        >
                            thoughts on code, tools, and random stuff i find
                            interesting.
                        </p>

                        <div class="flex items-center gap-4 text-sm mb-6">
                            <router-link
                                to="/"
                                class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                            >
                                [← home]
                            </router-link>
                        </div>

                        <div class="border-l-2 border-catppuccin-surface pl-4">
                            <div class="text-catppuccin-subtle text-sm mb-2">
                                ~$ ls tags/
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <button
                                    v-for="tag in tags"
                                    :key="tag"
                                    @click="toggleTag(tag)"
                                    :class="[
                                        'px-3 py-1 rounded text-xs transition-colors border',
                                        selectedTag === tag
                                            ? 'bg-catppuccin-mauve/20 text-catppuccin-mauve border-catppuccin-mauve'
                                            : 'bg-catppuccin-base/40 text-catppuccin-subtle border-catppuccin-surface hover:text-catppuccin-text hover:border-catppuccin-overlay',
                                    ]"
                                >
                                    {{ tag }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="border-l-2 border-catppuccin-surface pl-4">
                        <div class="text-catppuccin-subtle text-sm mb-3">
                            ~$ ls -la posts/
                            <span
                                v-if="selectedTag"
                                class="text-catppuccin-mauve"
                                >| grep "{{ selectedTag }}"</span
                            >
                        </div>

                        <div
                            v-if="!filteredPosts.length"
                            class="text-sm text-catppuccin-subtle"
                        >
                            no posts found
                        </div>

                        <div v-else class="space-y-3">
                            <div
                                v-for="post in filteredPosts"
                                :key="post.id"
                                @click="openPost(post.slug)"
                                class="block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40 transition-all cursor-pointer"
                            >
                                <div class="px-4 py-3">
                                    <div
                                        class="flex items-start justify-between gap-4 mb-2"
                                    >
                                        <h2
                                            class="text-base font-semibold text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors"
                                        >
                                            {{ post.title }}
                                        </h2>
                                        <span
                                            class="text-xs text-catppuccin-subtle flex-shrink-0"
                                        >
                                            {{ formatDate(post.date) }}
                                        </span>
                                    </div>

                                    <p
                                        class="text-sm text-catppuccin-gray mb-3 leading-relaxed"
                                    >
                                        {{ post.excerpt }}
                                    </p>

                                    <div class="flex items-center gap-2">
                                        <div class="flex flex-wrap gap-1.5">
                                            <span
                                                v-for="tag in post.tags"
                                                :key="tag"
                                                class="px-2 py-0.5 rounded text-xs bg-catppuccin-surface/60 text-catppuccin-subtle"
                                            >
                                                #{{ tag }}
                                            </span>
                                        </div>
                                        <span
                                            class="ml-auto text-catppuccin-subtle group-hover:text-catppuccin-mauve transition-colors text-sm"
                                        >
                                            read →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else-if="view === 'post' && currentPost" key="post">
                    <div class="mb-8">
                        <div class="text-catppuccin-subtle text-sm mb-2">
                            ~$ cat {{ currentPost.slug }}.md
                        </div>

                        <button
                            @click="goBack"
                            class="text-sm text-catppuccin-subtle hover:text-catppuccin-text transition-colors mb-6 inline-flex items-center gap-1"
                        >
                            ← back to posts
                        </button>

                        <h1
                            class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-3"
                        >
                            {{ currentPost.title }}
                        </h1>

                        <div
                            class="flex items-center gap-4 text-sm text-catppuccin-subtle mb-4"
                        >
                            <span>{{ formatDate(currentPost.date) }}</span>
                            <span class="text-catppuccin-surface">•</span>
                            <div class="flex gap-2">
                                <span
                                    v-for="tag in currentPost.tags"
                                    :key="tag"
                                    class="text-catppuccin-gray"
                                >
                                    #{{ tag }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <article
                        class="border-l-2 border-catppuccin-surface pl-4 mb-8"
                    >
                        <div
                            class="prose prose-invert max-w-none text-catppuccin-text"
                            v-html="parseMarkdown(currentPost.content)"
                        ></div>
                    </article>

                    <div class="border-l-2 border-catppuccin-surface pl-4">
                        <button
                            @click="goBack"
                            class="text-sm text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors inline-flex items-center gap-1"
                        >
                            ← back to all posts
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active {
    transition: all 0.3s ease-out;
}

.fade-leave-active {
    transition: all 0.2s ease-in;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

article :deep(a) {
    word-break: break-word;
}

article :deep(ul) {
    margin: 1rem 0;
}

article :deep(pre) {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.875rem;
    line-height: 1.6;
}

article :deep(code) {
    font-family: "JetBrains Mono", monospace;
}
</style>
