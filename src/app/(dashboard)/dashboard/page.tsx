"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Trash2,
  Receipt,
  Search,
  Filter,
  MoreVertical,
  AlertCircle,
  Plus,
  RefreshCcw,
  Slash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { Subscription } from "@/types/subscriptions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import PlanBadge from "./components/planBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TableSkeleton } from "@/components/skelton/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { EmptyState } from "./components/emptyState";
import { DeleteConfirmationDialog } from "./components/deleteDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
interface SubscriptionTableProps {
  onDelete?: (id: string) => Promise<void>;
  onViewDetails?: (id: string) => void;
  onViewInvoice?: (id: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const SubscriptionDashboard: React.FC<SubscriptionTableProps> = ({
  onDelete,
  onViewDetails,
  onViewInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id: userId } = useUser();
  const router = useRouter();

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/subscriptions/get/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch subscriptions");
      const data = await response.json();
      setSubscriptions(data.subscriptions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to load subscriptions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSubscriptions();
    }
  }, [userId]);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.apiInfo.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      sub.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (subscriptionId: string) => {
    setSelectedSubscriptionId(subscriptionId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSubscriptionId) return;

    try {
      setIsDeleting(true);
      await onDelete?.(selectedSubscriptionId);
      setSubscriptions((prev) =>
        prev.filter((sub) => sub.subscriptionId !== selectedSubscriptionId)
      );
      toast({
        title: "Success",
        description: "Subscription successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subscription",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedSubscriptionId(null);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-1 flex-col gap-4 p-4"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border-gray-100 w-full"
      >
        <div className="p-6 space-y-6">
          <motion.div variants={itemVariants}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Subscriptions</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                API Subscriptions
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your API subscriptions and usage
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={fetchSubscriptions}
                disabled={isLoading}
                className="hover:bg-gray-50 transition-colors"
              >
                <RefreshCcw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                onClick={() => router.push("/marketplace")}
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Subscription
              </Button>
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </motion.div>
        </div>
        <motion.div variants={itemVariants} className="w-full">
          {error ? (
            <Alert variant="destructive" className="m-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto border-t border-gray-100 ">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-[300px]">API Name</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton />
                  ) : filteredSubscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <EmptyState />
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubscriptions.map((subscription, index) => (
                      <TableRow
                        key={subscription.subscriptionId}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <button
                            onClick={() =>
                              onViewDetails?.(subscription.subscriptionId)
                            }
                            className="hover:text-blue-600 hover:underline text-left transition-colors"
                          >
                            <Link
                              href={`/dashboard/${subscription.applicationId}/${subscription.apiInfo.name}/${subscription.apiId}/generate-oauth-keys/production`}
                            >
                              {subscription.apiInfo.name}
                            </Link>
                          </button>
                        </TableCell>

                        <TableCell>
                          <PlanBadge
                            plan={subscription.requestedThrottlingPolicy}
                          />
                        </TableCell>
                        <TableCell>{subscription.apiInfo.version}</TableCell>
                        <TableCell className="text-gray-600">
                          {subscription.status}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() =>
                                  onViewDetails?.(subscription.subscriptionId)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onViewInvoice?.(subscription.subscriptionId)
                                }
                              >
                                <Receipt className="h-4 w-4 mr-2" /> View
                                Invoice
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteClick(subscription.subscriptionId)
                                }
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>
      </motion.div>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </motion.div>
  );
};

export default SubscriptionDashboard;
