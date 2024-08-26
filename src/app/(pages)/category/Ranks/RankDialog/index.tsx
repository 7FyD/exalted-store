import type { Product } from "../../../../../payload/payload-types";
import { AddToCartButton } from "../../../../_components/AddToCartButton";
import { RemoveFromCartButton } from "../../../../_components/RemoveFromCartButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../_components/ui/dialog";

interface RankDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const RankDialog: React.FC<RankDialogProps> = ({ isOpen, onClose, product }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product.title} rank benefits</DialogTitle>
          <DialogDescription>{product.additionalInformation[0]?.message}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p>benefit 1</p>
          <p>benefit 2</p>
          <p>benefit 3</p>
          <p>benefit 4</p>
          <p>benefit 5</p>
          <p>benefit 6</p>
          <p>benefit 7</p>
          <p>benefit 8</p>
          <p>benefit 9</p>
          <p>benefit 10</p>
        </div>
        <DialogFooter className="flex !flex-col gap-4 items-center justify-center">
          <AddToCartButton className="mx-auto" product={product} />
          <RemoveFromCartButton className="mx-auto" product={product} hideIfNotInCart />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RankDialog;
