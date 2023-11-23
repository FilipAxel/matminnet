import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6";
import { api } from "~/utils/api";

interface LikeButtonProps {
  recipeId: string;
  likes: number | undefined;
  userLikedRecipe: boolean | undefined;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  recipeId: id,
  likes,
  userLikedRecipe,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();
  const [likeCount, setLikeCount] = useState(likes || 0);
  const [recipeLiked, setRecipeLiked] = useState(userLikedRecipe || false);

  const { mutate: addRecipeLike } = api.recipe.addRecipeLike.useMutation({
    onError: (data, _variables, _context) => {
      console.log(data.message);
    },
  });

  const handleLike = () => {
    if (!session?.user.id) {
      return enqueueSnackbar("Login to Like this Recipe", {
        autoHideDuration: 3000,
        preventDuplicate: true,
        variant: "warning",
      });
    }
    addRecipeLike({ id });
    setLikeCount(recipeLiked ? likeCount - 1 : likeCount + 1);
    setRecipeLiked(!recipeLiked);
  };

  return (
    <>
      <div className="text-center">
        <Button
          size="sm"
          startContent={
            recipeLiked ? (
              <FaThumbsUp className="text-lg" />
            ) : (
              <FaRegThumbsUp className="text-lg" />
            )
          }
          onClick={handleLike}
          className={`${
            recipeLiked ? "bg-[#ff5722]" : "bg-[#b195d2]"
          } text-white`}
        >
          {likeCount}
        </Button>
      </div>
    </>
  );
};

export default LikeButton;
