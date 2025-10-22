<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { lanyardData } from "@/services/lanyardService";
import { getRecentTracks } from "@/services/lastfmService";

const discordStatusColor = computed(() => lanyardData.discordStatusColor);
const spotify = computed(() => lanyardData.spotify);
const discordStatus = computed(() => lanyardData.discordStatus);
const discordUser = computed(() => lanyardData.discordUser);
const editorActivity = computed(() => lanyardData.editorActivity);
const isLoading = computed(() => lanyardData.isLoading);

const editorStatus = computed(() => {
    if (!editorActivity.value) return null;

    if (
        editorActivity.value.details &&
        editorActivity.value.details.toLowerCase().includes("idling")
    ) {
        return "idling";
    }

    const editorName = editorActivity.value.name;
    const isZed = editorName === "Zed";

    let filename = isZed
        ? editorActivity.value.state || ""
        : editorActivity.value.details || "";

    let workspace = isZed
        ? editorActivity.value.details || ""
        : editorActivity.value.state || "";

    filename = filename
        .replace(/editing /i, "")
        .replace(/working on /i, "")
        .trim();

    workspace = workspace
        .replace(/in /i, "")
        .replace(/workspace: /i, "")
        .trim();

    return {
        name: editorName,
        workspace,
        filename,
    };
});

const repos = ref([]);
const reposLoading = ref(true);
const reposInitialLoad = ref(true);
const allTracks = ref([]);
const songsLoading = ref(true);
const songsInitialLoad = ref(true);
const songsError = ref(null);
let updateInterval = null;

const currentTrack = computed(() =>
    allTracks.value.find((track) => track["@attr"]?.nowplaying),
);

const consolidatedTracks = computed(() => {
    const tracks = allTracks.value.filter(
        (track) => !track["@attr"]?.nowplaying,
    );
    const consolidated = [];
    let currentTrack = null;
    let count = 1;

    tracks.forEach((track, index) => {
        const key = `${track.name}-${track.artist["#text"]}`;
        if (currentTrack === key) {
            count++;
        } else {
            if (currentTrack) {
                const prevTrack = tracks[index - 1];
                consolidated.push({
                    ...prevTrack,
                    playcount: count,
                    date: prevTrack.date?.["#text"],
                });
            }
            currentTrack = key;
            count = 1;
        }
        if (index === tracks.length - 1) {
            consolidated.push({
                ...track,
                playcount: count,
                date: track.date?.["#text"],
            });
        }
    });

    return consolidated.slice(0, 10);
});

const fetchSongs = async () => {
    try {
        songsLoading.value = true;
        allTracks.value = await getRecentTracks();
        songsError.value = null;
    } catch {
        songsError.value = "couldn't load tracks";
    } finally {
        songsLoading.value = false;
        songsInitialLoad.value = false;
    }
};

const fetchProjects = async () => {
    try {
        reposLoading.value = true;
        const res = await fetch("https://api.github.com/users/lostf1sh/repos");
        const data = await res.json();
        repos.value = data.sort(
            (a, b) => b.stargazers_count - a.stargazers_count,
        );
    } catch {
    } finally {
        reposLoading.value = false;
        reposInitialLoad.value = false;
    }
};

onMounted(() => {
    fetchProjects();
    fetchSongs();
    updateInterval = setInterval(fetchSongs, 30000);
});

onBeforeUnmount(() => {
    if (updateInterval) clearInterval(updateInterval);
});
</script>

<template>
    <div class="w-full min-h-screen overflow-x-hidden font-mono">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            <div class="mb-12">
                <div class="mb-8">
                    <div class="text-catppuccin-subtle text-sm mb-2">
                        ~$ whoami
                    </div>
                    <h1
                        class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-2"
                    >
                        <span class="text-catppuccin-mauve">duhan</span>
                        <span class="text-catppuccin-subtle">@</span>
                        <span class="text-catppuccin-blue">f1sh.dev</span>
                    </h1>
                    <div class="text-sm text-catppuccin-gray mb-4">
                        <span class="text-catppuccin-subtle">aka </span
                        ><span class="text-catppuccin-green">moli</span>
                    </div>

                    <div class="flex items-center flex-wrap gap-4 text-sm">
                        <router-link
                            to="/blog"
                            class="text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors"
                        >
                            [blog]
                        </router-link>
                        <a
                            href="https://github.com/lostf1sh"
                            target="_blank"
                            class="text-catppuccin-subtle hover:text-catppuccin-text transition-colors"
                        >
                            [github]
                        </a>
                        <a
                            href="https://www.instagram.com/lxstf1sh"
                            target="_blank"
                            class="text-catppuccin-subtle hover:text-catppuccin-pink transition-colors"
                        >
                            [instagram]
                        </a>
                        <a
                            href="https://open.spotify.com/user/31q6jft6qtkzisve7zu2o2mytyry?si=1c9f27a30d25435b"
                            target="_blank"
                            class="text-catppuccin-subtle hover:text-catppuccin-green transition-colors"
                        >
                            [spotify]
                        </a>
                    </div>
                </div>

                <div class="border-l-2 border-catppuccin-surface pl-4 mb-4">
                    <div class="text-catppuccin-subtle text-sm mb-2">
                        ~$ cat about.txt
                    </div>
                    <p class="text-catppuccin-text leading-relaxed mb-4">
                        junior dev. building stuff and learning along the way.
                        code, table tennis, cooking. based in turkey.
                    </p>
                </div>

                <div class="border-l-2 border-catppuccin-surface pl-4 mb-4">
                    <div class="text-catppuccin-subtle text-sm mb-2">
                        ~$ ps aux | grep duhan
                    </div>
                    <div class="space-y-1 text-sm">
                        <div
                            v-if="!isLoading && discordUser"
                            class="flex items-center gap-2"
                        >
                            <span class="text-catppuccin-blue">discord</span>
                            <span class="text-catppuccin-subtle">:</span>
                            <span class="text-catppuccin-text">{{
                                discordUser.username
                            }}</span>
                            <span :class="discordStatusColor"
                                >[{{ discordStatus }}]</span
                            >
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="text-catppuccin-green">spotify</span>
                            <span class="text-catppuccin-subtle">:</span>
                            <span
                                v-if="!isLoading && spotify"
                                class="text-catppuccin-text truncate"
                            >
                                {{ spotify.song }} - {{ spotify.artist }}
                            </span>
                            <span v-else class="text-catppuccin-subtle"
                                >not playing</span
                            >
                        </div>

                        <div
                            v-if="
                                !isLoading &&
                                editorActivity &&
                                editorStatus &&
                                (editorStatus.workspace ||
                                    editorStatus.filename)
                            "
                            class="flex items-center gap-2"
                        >
                            <span class="text-catppuccin-blue">{{
                                editorStatus.name === "Zed" ? "zed" : "vscode"
                            }}</span>
                            <span class="text-catppuccin-subtle">:</span>
                            <span class="text-catppuccin-text truncate">
                                <span v-if="editorStatus.workspace">{{
                                    editorStatus.workspace.toLowerCase()
                                }}</span>
                                <span
                                    v-if="
                                        editorStatus.workspace &&
                                        editorStatus.filename
                                    "
                                    class="text-catppuccin-subtle"
                                >
                                    /
                                </span>
                                <span v-if="editorStatus.filename">{{
                                    editorStatus.filename.toLowerCase()
                                }}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="border-l-2 border-catppuccin-surface pl-4 mb-4">
                    <div class="text-catppuccin-subtle text-sm mb-2">
                        ~$ ls ~/tools
                    </div>
                    <div class="text-sm text-catppuccin-text">
                        vue | git | nextjs | dart | python | js/ts | docker |
                        bash |
                    </div>
                </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6">
                <div class="border-l-2 border-catppuccin-surface pl-4 min-w-0">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ ls ~/projects
                    </div>

                    <div v-if="reposLoading" class="space-y-2">
                        <div
                            v-for="i in 6"
                            :key="`repo-loading-${i}`"
                            class="rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 p-3 animate-pulse"
                        >
                            <div class="flex items-start gap-3">
                                <span class="text-catppuccin-subtle">></span>
                                <div class="flex-1 min-w-0">
                                    <div
                                        class="h-3 bg-catppuccin-surface/70 rounded w-2/3 mb-2"
                                    ></div>
                                    <div
                                        class="h-2 bg-catppuccin-surface/50 rounded w-1/3"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        v-else-if="!repos.length"
                        class="text-sm text-catppuccin-subtle"
                    >
                        no projects found
                    </div>

                    <TransitionGroup
                        v-else
                        :name="reposInitialLoad ? '' : 'list'"
                        tag="div"
                        class="space-y-2"
                    >
                        <a
                            v-for="(repo, index) in repos.slice(0, 6)"
                            :key="repo.id"
                            :href="repo.html_url"
                            target="_blank"
                            :style="{ transitionDelay: `${index * 50}ms` }"
                            class="block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40 transition-colors"
                        >
                            <div
                                class="flex items-start gap-3 text-sm hover:text-catppuccin-mauve transition-colors px-3 py-2"
                            >
                                <span
                                    class="text-catppuccin-subtle group-hover:text-catppuccin-mauve transition-colors"
                                    >></span
                                >

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors font-medium truncate"
                                            :title="repo.name"
                                        >
                                            {{ repo.name }}
                                        </span>

                                        <span
                                            v-if="repo.stargazers_count > 0"
                                            class="text-catppuccin-yellow text-xs flex-shrink-0"
                                        >
                                            ★{{ repo.stargazers_count }}
                                        </span>
                                    </div>

                                    <p
                                        class="text-xs text-catppuccin-gray truncate"
                                        :title="repo.description"
                                    >
                                        {{
                                            repo.description || "no description"
                                        }}
                                    </p>
                                </div>
                            </div>
                        </a>
                    </TransitionGroup>
                </div>

                <div class="border-l-2 border-catppuccin-surface pl-4 min-w-0">
                    <div class="text-catppuccin-subtle text-sm mb-3">
                        ~$ cat recent_tracks.log
                    </div>

                    <div v-if="songsLoading" class="space-y-2">
                        <div
                            v-for="i in 6"
                            :key="`loading-${i}`"
                            class="rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 p-3 animate-pulse"
                        >
                            <div class="flex items-start gap-3">
                                <span class="text-catppuccin-subtle">></span>
                                <div class="flex-1 min-w-0">
                                    <div
                                        class="h-3 bg-catppuccin-surface/70 rounded w-2/3 mb-2"
                                    ></div>
                                    <div
                                        class="h-2 bg-catppuccin-surface/50 rounded w-1/3"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        v-else-if="songsError"
                        class="text-sm text-catppuccin-red"
                    >
                        error: {{ songsError }}
                    </div>

                    <div
                        v-else-if="!consolidatedTracks.length && !currentTrack"
                        class="text-sm text-catppuccin-subtle"
                    >
                        no tracks found
                    </div>

                    <TransitionGroup
                        v-else
                        :name="songsInitialLoad ? '' : 'list'"
                        tag="div"
                        class="space-y-2"
                    >
                        <a
                            v-if="currentTrack"
                            :href="currentTrack.url"
                            target="_blank"
                            :key="`current-${currentTrack.name}-${currentTrack.artist['#text']}`"
                            class="block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40 transition-colors"
                        >
                            <div
                                class="flex items-start gap-3 text-sm px-3 py-2"
                            >
                                <span class="text-catppuccin-green">♪</span>

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-catppuccin-text group-hover:text-catppuccin-green transition-colors truncate"
                                            :title="currentTrack.name"
                                        >
                                            {{ currentTrack.name }}
                                        </span>

                                        <span
                                            class="text-catppuccin-green text-xs flex-shrink-0"
                                            >[now]</span
                                        >
                                    </div>

                                    <p
                                        class="text-xs text-catppuccin-gray truncate"
                                        :title="currentTrack.artist['#text']"
                                    >
                                        {{ currentTrack.artist["#text"] }}
                                    </p>
                                </div>
                            </div>
                        </a>

                        <a
                            v-for="(track, index) in consolidatedTracks.slice(
                                0,
                                currentTrack ? 5 : 6,
                            )"
                            :key="`${track.name}-${track.artist['#text']}-${track.date}`"
                            :href="track.url"
                            target="_blank"
                            :style="{
                                transitionDelay: `${(index + (currentTrack ? 1 : 0)) * 50}ms`,
                            }"
                            class="block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40 transition-colors"
                        >
                            <div
                                class="flex items-start gap-3 text-sm px-3 py-2"
                            >
                                <span
                                    class="text-catppuccin-subtle group-hover:text-catppuccin-green transition-colors"
                                    >></span
                                >

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-catppuccin-text group-hover:text-catppuccin-green transition-colors truncate"
                                            :title="track.name"
                                        >
                                            {{ track.name }}
                                        </span>

                                        <span
                                            v-if="track.playcount > 1"
                                            class="text-catppuccin-yellow text-xs flex-shrink-0"
                                        >
                                            ×{{ track.playcount }}
                                        </span>
                                    </div>

                                    <p
                                        class="text-xs text-catppuccin-gray truncate"
                                        :title="track.artist['#text']"
                                    >
                                        {{ track.artist["#text"] }}
                                    </p>
                                </div>
                            </div>
                        </a>
                    </TransitionGroup>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.list-enter-active {
    transition: all 0.4s ease-out;
}

.list-leave-active {
    transition: all 0.3s ease-in;
    position: absolute;
}

.list-enter-from {
    opacity: 0;
    transform: translateY(15px);
}

.list-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}

.list-move {
    transition: transform 0.4s ease;
}
</style>
