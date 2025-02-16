import { TableCell, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";

 export const TableSkeleton: React.FC = () => (
    <>

      {[...Array(5)].map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          <TableCell>   
            <Skeleton className="h-6 w-[250px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-[150px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );    