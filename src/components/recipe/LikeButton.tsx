import { Button } from "@nextui-org/react";
import { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
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
  const [likeCount, setLikeCount] = useState(likes || 0);
  const [recipeLiked, setRecipeLiked] = useState(userLikedRecipe || false);

  const { mutate: addRecipeLike } = api.recipe.addRecipeLike.useMutation({
    onSuccess: (data, _variables, _context) => {
      if (data?.message !== "Like removed") {
        setLikeCount(likeCount + 1);
        setRecipeLiked(true);
      } else {
        setLikeCount(likeCount - 1);
        setRecipeLiked(false);
      }
    },
  });

  const handleLike = () => {
    addRecipeLike({ id });
  };

  return (
    <>
      <div className="mt-5 text-center">
        <Button
          size="sm"
          startContent={<AiFillHeart />}
          onClick={handleLike}
          className={`${
            recipeLiked ? "bg-[#ff5722]" : "bg-[#b195d2]"
          } text-white`}
        >
          {likeCount} {recipeLiked ? "Liked" : "Like"}
        </Button>
      </div>
    </>
  );
};

export default LikeButton;
