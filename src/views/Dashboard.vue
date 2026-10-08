<template>
  <div class="min-h-screen bg-[#0B0F19] text-white">
    <!-- Mobile Overlay -->
    <Transition name="fade">
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        @click="mobileMenuOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-800 bg-[#0B0F19]/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo -->
      <div class="flex h-20 items-center justify-between border-b border-gray-800 px-6">
        <RouterLink
          to="/"
          class="flex items-center gap-3"
          @click="mobileMenuOpen = false"
        >
          <img
            src="/public/img/logo.png"
            alt="Global Funds"
            class="h-10 w-auto"
          />

          <div>
            <h1 class="text-lg font-bold tracking-tight">
              Global Funds
            </h1>

            <p class="text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Investment
            </p>
          </div>
        </RouterLink>

        <button
          class="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden"
          @click="mobileMenuOpen = false"
        >
          <Icon icon="solar:close-circle-bold" class="text-xl" />
        </button>
      </div>

      <!-- User -->
      <div class="border-b border-gray-800 p-5">
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-[#0B0F19]"
          >
            {{ userInitials }}
          </div>

          <div class="min-w-0">
            <p class="truncate font-semibold">
              {{ fullName }}
            </p>

            <p class="truncate text-xs text-gray-500">
              {{ user?.email }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 space-y-2 p-4">
        <p
          class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600"
        >
          Main Menu
        </p>

        <RouterLink
          to="/dashboard"
          class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition"
          :class="
            isActive('/dashboard')
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          "
          @click="mobileMenuOpen = false"
        >
          <Icon icon="solar:widget-2-bold" class="text-xl" />
          Dashboard
        </RouterLink>

        <RouterLink
          to="/market"
          class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
          @click="mobileMenuOpen = false"
        >
          <Icon icon="solar:chart-square-bold" class="text-xl" />
          Investment Market
        </RouterLink>

        <button
          class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <Icon icon="solar:wallet-money-bold" class="text-xl" />
          Transactions
        </button>

        <button
          class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <Icon icon="solar:user-bold" class="text-xl" />
          Profile
        </button>
      </nav>

      <!-- Logout -->
      <div class="border-t border-gray-800 p-4">
        <button
          :disabled="loggingOut"
          class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          @click="logout"
        >
          <Icon
            v-if="!loggingOut"
            icon="solar:logout-2-bold"
            class="text-xl"
          />

          <Icon
            v-else
            icon="svg-spinners:ring-resize"
            class="text-xl"
          />

          {{ loggingOut ? "Signing out..." : "Sign out" }}
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="min-h-screen lg:pl-72">
      <!-- Header -->
      <header
        class="sticky top-0 z-30 border-b border-gray-800 bg-[#0B0F19]/80 backdrop-blur-xl"
      >
        <div class="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-3">
            <button
              class="rounded-xl border border-gray-700/50 bg-white/5 p-2.5 text-gray-300 lg:hidden"
              @click="mobileMenuOpen = true"
            >
              <Icon icon="solar:hamburger-menu-bold" class="text-xl" />
            </button>

            <div>
              <p class="text-xs text-gray-500">
                {{ greeting }}
              </p>

              <h2 class="text-lg font-semibold">
                Welcome back, {{ user?.firstName || "Investor" }}
              </h2>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              class="hidden rounded-xl border border-gray-700/50 bg-white/5 p-2.5 text-gray-400 transition hover:bg-white/10 hover:text-white sm:block"
              title="Notifications"
            >
              <Icon icon="solar:bell-bold" class="text-xl" />
            </button>

            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-[#0B0F19]"
            >
              {{ userInitials }}
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <!-- Loading -->
        <div v-if="loading" class="space-y-6">
          <div class="h-28 animate-pulse rounded-3xl bg-white/5" />

          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div
              v-for="item in 4"
              :key="item"
              class="h-32 animate-pulse rounded-2xl bg-white/5"
            />
          </div>

          <div class="h-80 animate-pulse rounded-2xl bg-white/5" />
        </div>

        <!-- Dashboard -->
        <div v-else class="space-y-8">
          <!-- Welcome -->
          <section class="dashboard-item">
            <div
              class="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-[#0B0F19] p-6 shadow-2xl shadow-emerald-950/30 sm:p-8"
            >
              <div
                class="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl"
              />

              <div
                class="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"
              />

              <div class="relative">
                <p class="mb-2 text-sm text-emerald-200">
                  Your investment portfolio
                </p>

                <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                  <div>
                    <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
                      {{ formatCurrency(stats.portfolioValue) }}
                    </h1>

                    <p class="mt-2 text-sm text-emerald-200">
                      Current portfolio value
                    </p>
                  </div>

                  <RouterLink
                    to="/market"
                    class="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Explore Funds
                    <Icon icon="solar:arrow-right-bold" />
                  </RouterLink>
                </div>
              </div>
            </div>
          </section>

          <!-- Stats -->
          <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <!-- Total Invested -->
            <div class="dashboard-item stat-card">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-sm text-gray-500">
                    Total Invested
                  </p>

                  <p class="mt-2 text-2xl font-bold">
                    {{ formatCurrency(stats.totalInvested) }}
                  </p>
                </div>

                <div class="stat-icon bg-emerald-500/10 text-emerald-400">
                  <Icon icon="solar:wallet-money-bold" />
                </div>
              </div>

              <p class="mt-4 flex items-center gap-1 text-xs text-gray-500">
                <Icon icon="solar:info-circle-bold" />
                Amount invested in funds
              </p>
            </div>

            <!-- Profit -->
            <div class="dashboard-item stat-card">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-sm text-gray-500">
                    Total Returns
                  </p>

                  <p class="mt-2 text-2xl font-bold text-emerald-400">
                    {{ formatCurrency(stats.totalProfit) }}
                  </p>
                </div>

                <div class="stat-icon bg-emerald-500/10 text-emerald-400">
                  <Icon icon="solar:graph-up-bold" />
                </div>
              </div>

              <p class="mt-4 flex items-center gap-1 text-xs text-emerald-400">
                <Icon icon="solar:arrow-up-bold" />
                Completed returns
              </p>
            </div>

            <!-- Investments -->
            <div class="dashboard-item stat-card">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-sm text-gray-500">
                    Investments
                  </p>

                  <p class="mt-2 text-2xl font-bold">
                    {{ stats.investmentCount }}
                  </p>
                </div>

                <div class="stat-icon bg-emerald-500/10 text-emerald-400">
                  <Icon icon="solar:chart-2-bold" />
                </div>
              </div>

              <p class="mt-4 text-xs text-gray-500">
                Active investment records
              </p>
            </div>

            <!-- Transactions -->
            <div class="dashboard-item stat-card">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-sm text-gray-500">
                    Transactions
                  </p>

                  <p class="mt-2 text-2xl font-bold">
                    {{ stats.transactionCount }}
                  </p>
                </div>

                <div class="stat-icon bg-emerald-500/10 text-emerald-400">
                  <Icon icon="solar:transfer-horizontal-bold" />
                </div>
              </div>

              <p class="mt-4 text-xs text-gray-500">
                Total account transactions
              </p>
            </div>
          </section>

          <!-- Main Grid -->
          <section class="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <!-- Investments -->
            <div class="dashboard-item panel">
              <div class="mb-6 flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold">
                    My Investments
                  </h3>

                  <p class="mt-1 text-xs text-gray-500">
                    Your current investment portfolio
                  </p>
                </div>

                <RouterLink
                  to="/market"
                  class="text-xs font-medium text-emerald-400 hover:text-emerald-300"
                >
                  Browse funds
                </RouterLink>
              </div>

              <!-- Empty -->
              <div
                v-if="investments.length === 0"
                class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-700/50 px-6 py-12 text-center"
              >
                <div
                  class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400"
                >
                  <Icon icon="solar:chart-2-bold" class="text-2xl" />
                </div>

                <h4 class="font-semibold">
                  No investments yet
                </h4>

                <p class="mt-2 max-w-sm text-sm text-gray-500">
                  You haven't invested in any funds yet. Explore the market
                  and start building your portfolio.
                </p>

                <RouterLink
                  to="/market"
                  class="mt-5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-[#0B0F19] transition hover:bg-emerald-400"
                >
                  Explore funds
                </RouterLink>
              </div>

              <!-- Investments List -->
              <div v-else class="space-y-3">
                <div
                  v-for="investment in investments"
                  :key="investment.id"
                  class="group flex flex-col gap-4 rounded-2xl border border-gray-800 bg-white/[0.025] p-4 transition hover:border-emerald-500/20 hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div class="flex min-w-0 items-center gap-4">
                    <div
                      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"
                    >
                      <Icon icon="solar:buildings-2-bold" />
                    </div>

                    <div class="min-w-0">
                      <h4 class="truncate font-semibold">
                        {{ investment.fund.name }}
                      </h4>

                      <div class="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span class="text-gray-500">
                          {{ investment.fund.category }}
                        </span>

                        <span class="text-gray-700">•</span>

                        <span
                          :class="riskClass(investment.fund.riskLevel)"
                        >
                          {{ investment.fund.riskLevel }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="sm:text-right">
                    <p class="font-semibold">
                      {{
                        formatCurrency(
                          Number(investment.amount),
                          investment.fund.currency
                        )
                      }}
                    </p>

                    <p class="mt-1 text-xs text-gray-500">
                      {{ formatDate(investment.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Transactions -->
            <div class="dashboard-item panel">
              <div class="mb-6 flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold">
                    Recent Transactions
                  </h3>

                  <p class="mt-1 text-xs text-gray-500">
                    Latest account activity
                  </p>
                </div>
              </div>

              <div
                v-if="recentTransactions.length === 0"
                class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-700/50 px-6 py-12 text-center"
              >
                <div
                  class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-700/20 text-gray-400"
                >
                  <Icon icon="solar:transfer-horizontal-bold" class="text-2xl" />
                </div>

                <h4 class="font-semibold">
                  No transactions
                </h4>

                <p class="mt-2 text-sm text-gray-500">
                  Your recent transactions will appear here.
                </p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="transaction in recentTransactions"
                  :key="transaction.id"
                  class="flex items-center justify-between gap-3"
                >
                  <div class="flex min-w-0 items-center gap-3">
                    <div
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      :class="transactionIconClass(transaction.type)"
                    >
                      <Icon :icon="transactionIcon(transaction.type)" />
                    </div>

                    <div class="min-w-0">
                      <p class="truncate text-sm font-medium">
                        {{ formatTransactionType(transaction.type) }}
                      </p>

                      <p class="mt-1 text-xs text-gray-500">
                        {{ formatDate(transaction.createdAt) }}
                      </p>
                    </div>
                  </div>

                  <div class="shrink-0 text-right">
                    <p
                      class="text-sm font-semibold"
                      :class="transactionAmountClass(transaction.type)"
                    >
                      {{ transactionSign(transaction.type) }}
                      {{ formatCurrency(Number(transaction.amount)) }}
                    </p>

                    <span
                      class="mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium"
                      :class="statusClass(transaction.status)"
                    >
                      {{ transaction.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Account Information -->
          <section class="dashboard-item panel">
            <div class="mb-6">
              <h3 class="text-lg font-semibold">
                Account Information
              </h3>

              <p class="mt-1 text-xs text-gray-500">
                Your Global Funds account details
              </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div class="rounded-xl bg-white/[0.03] p-4">
                <p class="text-xs text-gray-500">
                  Full Name
                </p>

                <p class="mt-2 font-medium">
                  {{ fullName }}
                </p>
              </div>

              <div class="rounded-xl bg-white/[0.03] p-4">
                <p class="text-xs text-gray-500">
                  Email
                </p>

                <p class="mt-2 truncate font-medium">
                  {{ user?.email || "—" }}
                </p>
              </div>

              <div class="rounded-xl bg-white/[0.03] p-4">
                <p class="text-xs text-gray-500">
                  Account Type
                </p>

                <p class="mt-2 font-medium">
                  {{ user?.role || "USER" }}
                </p>
              </div>

              <div class="rounded-xl bg-white/[0.03] p-4">
                <p class="text-xs text-gray-500">
                  Member Since
                </p>

                <p class="mt-2 font-medium">
                  {{ user?.createdAt ? formatDate(user.createdAt) : "—" }}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import gsap from "gsap";
import api from "../api/client";

const router = useRouter();
const route = useRoute();

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
}

interface Fund {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  riskLevel: string;
  minInvestment: string | number;
  expectedReturn: string | number;
  currency: string;
  isActive: boolean;
}

interface Investment {
  id: string;
  amount: string | number;
  createdAt: string;
  fund: Fund;
}

interface Transaction {
  id: string;
  type: string;
  amount: string | number;
  status: string;
  reference: string;
  createdAt: string;
}

interface DashboardStats {
  portfolioValue: number;
  totalInvested: number;
  totalProfit: number;
  investmentCount: number;
  transactionCount: number;
}

/* -------------------------------------------------------------------------- */
/* State                                                                      */
/* -------------------------------------------------------------------------- */

const user = ref<AuthUser | null>(null);

const loading = ref(true);
const loadingDashboard = ref(false);
const mobileMenuOpen = ref(false);
const loggingOut = ref(false);

const stats = ref<DashboardStats>({
  portfolioValue: 0,
  totalInvested: 0,
  totalProfit: 0,
  investmentCount: 0,
  transactionCount: 0,
});

const investments = ref<Investment[]>([]);
const recentTransactions = ref<Transaction[]>([]);

/* -------------------------------------------------------------------------- */
/* Computed                                                                   */
/* -------------------------------------------------------------------------- */

const fullName = computed(() => {
  if (!user.value) return "Investor";

  return `${user.value.firstName} ${user.value.lastName}`.trim();
});

const userInitials = computed(() => {
  if (!user.value) return "GF";

  const first = user.value.firstName?.charAt(0) || "";
  const last = user.value.lastName?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "GF";
});

const greeting = computed(() => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";

  return "Good evening";
});

/* -------------------------------------------------------------------------- */
/* Authentication                                                             */
/* -------------------------------------------------------------------------- */

const checkUser = async (): Promise<boolean> => {
  const token = localStorage.getItem("token");

  if (!token) {
    await router.replace({
      name: "login",
      query: {
        redirect: "/dashboard",
      },
    });

    return false;
  }

  try {
    const response = await api.get("/auth/me");

    user.value = response.data?.data?.user ?? null;

    if (!user.value) {
      throw new Error("User information was not returned.");
    }

    return true;
  } catch (error) {
    console.error("Authentication error:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    await router.replace({
      name: "login",
      query: {
        redirect: "/dashboard",
      },
    });

    return false;
  } finally {
    loading.value = false;
  }
};

/* -------------------------------------------------------------------------- */
/* Dashboard API                                                              */
/* -------------------------------------------------------------------------- */

const loadDashboard = async () => {
  loadingDashboard.value = true;

  try {
    const response = await api.get("/dashboard");

    const dashboard = response.data?.data;

    if (!dashboard) {
      throw new Error("Dashboard data was not returned.");
    }

    if (dashboard.user) {
      user.value = dashboard.user;
    }

    stats.value = {
      portfolioValue: Number(dashboard.stats?.portfolioValue ?? 0),
      totalInvested: Number(dashboard.stats?.totalInvested ?? 0),
      totalProfit: Number(dashboard.stats?.totalProfit ?? 0),
      investmentCount: Number(dashboard.stats?.investmentCount ?? 0),
      transactionCount: Number(dashboard.stats?.transactionCount ?? 0),
    };

    investments.value = dashboard.investments ?? [];
    recentTransactions.value = dashboard.recentTransactions ?? [];
  } catch (error: any) {
    console.error("Failed to load dashboard:", error);

    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      await router.replace({
        name: "login",
        query: {
          redirect: "/dashboard",
        },
      });
    }
  } finally {
    loadingDashboard.value = false;
  }
};

/* -------------------------------------------------------------------------- */
/* Logout                                                                     */
/* -------------------------------------------------------------------------- */

const logout = async () => {
  if (loggingOut.value) return;

  loggingOut.value = true;

  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    user.value = null;

    await router.replace({
      name: "login",
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    loggingOut.value = false;
  }
};

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

const formatCurrency = (
  amount: number,
  currency = "USD"
): string => {
  const safeAmount = Number(amount) || 0;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `${currency} ${safeAmount.toFixed(2)}`;
  }
};

const formatDate = (date: string): string => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

const formatTransactionType = (type: string): string => {
  const names: Record<string, string> = {
    DEPOSIT: "Deposit",
    WITHDRAWAL: "Withdrawal",
    INVESTMENT: "Investment",
    RETURN: "Return",
  };

  return (
    names[type?.toUpperCase()] ||
    type?.replace(/_/g, " ") ||
    "Transaction"
  );
};

const transactionSign = (type: string): string => {
  const upper = type?.toUpperCase();

  if (upper === "DEPOSIT" || upper === "RETURN") {
    return "+";
  }

  if (upper === "WITHDRAWAL" || upper === "INVESTMENT") {
    return "-";
  }

  return "";
};

/* -------------------------------------------------------------------------- */
/* UI Helpers                                                                 */
/* -------------------------------------------------------------------------- */

const isActive = (path: string): boolean => {
  return route.path === path;
};

const riskClass = (risk: string): string => {
  switch (risk?.toUpperCase()) {
    case "LOW":
      return "text-emerald-400";

    case "HIGH":
      return "text-red-400";

    default:
      return "text-yellow-400";
  }
};

const transactionIcon = (type: string): string => {
  switch (type?.toUpperCase()) {
    case "DEPOSIT":
      return "solar:arrow-down-left-bold";

    case "WITHDRAWAL":
      return "solar:arrow-up-right-bold";

    case "INVESTMENT":
      return "solar:chart-2-bold";

    case "RETURN":
      return "solar:graph-up-bold";

    default:
      return "solar:transfer-horizontal-bold";
  }
};

const transactionIconClass = (type: string): string => {
  switch (type?.toUpperCase()) {
    case "DEPOSIT":
      return "bg-emerald-500/10 text-emerald-400";

    case "WITHDRAWAL":
      return "bg-red-500/10 text-red-400";

    case "INVESTMENT":
      return "bg-emerald-500/10 text-emerald-400";

    case "RETURN":
      return "bg-green-500/10 text-green-400";

    default:
      return "bg-gray-700/20 text-gray-400";
  }
};

const transactionAmountClass = (type: string): string => {
  switch (type?.toUpperCase()) {
    case "DEPOSIT":
    case "RETURN":
      return "text-emerald-400";

    case "WITHDRAWAL":
    case "INVESTMENT":
      return "text-gray-200";

    default:
      return "text-gray-200";
  }
};

const statusClass = (status: string): string => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "bg-emerald-500/10 text-emerald-400";

    case "PENDING":
      return "bg-yellow-500/10 text-yellow-400";

    case "FAILED":
      return "bg-red-500/10 text-red-400";

    case "CANCELLED":
      return "bg-gray-700/20 text-gray-400";

    default:
      return "bg-gray-700/20 text-gray-400";
  }
};

/* -------------------------------------------------------------------------- */
/* Animation                                                                  */
/* -------------------------------------------------------------------------- */

const animateDashboard = () => {
  requestAnimationFrame(() => {
    gsap.fromTo(
      ".dashboard-item",
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  });
};

/* -------------------------------------------------------------------------- */
/* Lifecycle                                                                  */
/* -------------------------------------------------------------------------- */

onMounted(async () => {
  const authenticated = await checkUser();

  if (!authenticated) return;

  await loadDashboard();

  animateDashboard();
});
</script>

<!-- <style scoped>
.stat-card {
  @apply rounded-2xl border border-gray-800 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-gray-700 hover:bg-white/[0.04];
}

.stat-icon {
  @apply flex h-11 w-11 items-center justify-center rounded-xl text-xl;
}

.panel {
  @apply rounded-2xl border border-gray-800 bg-white/[0.025] p-5 sm:p-6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> -->