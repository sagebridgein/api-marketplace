import { Badge } from "@/components/ui/badge";

const PlanBadge: React.FC<{ plan: string }> = ({ plan }) => {
  const planConfig = {
    Basic: "bg-gray-100 text-gray-800",
    Pro: "bg-blue-100 text-blue-800",
    Enterprise: "bg-purple-100 text-purple-800",
    Default: "bg-gray-100 text-gray-800",

  };

  const planClass =
    planConfig[plan as keyof typeof planConfig] || planConfig.Default;
  return (
    <Badge variant="outline" className={`${planClass} border-0 font-medium`}>
      {plan}
    </Badge>
  );
};

export default PlanBadge;
