export type ID = string;

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UserRole = "trainer" | "studio_owner" | "coach_manager";

export type SubscriptionPlan = "basic" | "pro" | "studio";
export type SubscriptionStatus = "trial" | "active" | "past_due" | "cancelled";

export type User = {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  plan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt?: string;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken?: string;
};

export type DashboardStats = {
  clientsCount: number;
  activePlansCount: number;
  monthlyRevenue: number;
  activationRate: number;
  retentionRate: number;
  pendingPayments: number;
};

export type Client = {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
  status: "active" | "inactive" | "lead";
  createdAt: string;
};

export type CreateClientInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
};

export type UpdateClientInput = Partial<CreateClientInput> & {
  status?: "active" | "inactive" | "lead";
};

export type Exercise = {
  id: ID;
  name: string;
  category: string;
  description?: string;
  videoUrl?: string;
};

export type WorkoutPlan = {
  id: ID;
  name: string;
  clientId: ID;
  goal?: string;
  notes?: string;
  exercises: Array<{
    exerciseId: ID;
    sets: number;
    reps: string;
    restSeconds?: number;
    tempo?: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type CreateWorkoutPlanInput = {
  name: string;
  clientId: ID;
  goal?: string;
  notes?: string;
  exercises: Array<{
    exerciseId: ID;
    sets: number;
    reps: string;
    restSeconds?: number;
    tempo?: string;
  }>;
};

export type ProgressEntry = {
  id: ID;
  clientId: ID;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  strengthNotes?: string;
  createdAt: string;
};

export type CreateProgressEntryInput = {
  clientId: ID;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  strengthNotes?: string;
};

export type Payment = {
  id: ID;
  clientId: ID;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  paidAt?: string;
  createdAt: string;
};

export type CreateCheckoutSessionResponse = {
  checkoutUrl: string;
};

export type RevenueReport = {
  month: string;
  revenue: number;
  activeClients: number;
  churnRate: number;
};

export type TeamMember = {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  role: "owner" | "trainer" | "manager";
  active: boolean;
};

export type InviteTeamMemberInput = {
  email: string;
  role: "trainer" | "manager";
};

export type DemoRequestInput = {
  name: string;
  email: string;
  company?: string;
  message?: string;
};

export type LeadMagnetInput = {
  email: string;
};