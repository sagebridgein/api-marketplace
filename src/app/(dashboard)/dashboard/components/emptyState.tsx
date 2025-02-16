export const EmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center">
        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          No subscriptions found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new subscription.
        </p>
        <div className="mt-6">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Subscription
          </Button>
        </div>
      </div>
    </div>
  );
  