import { MdOutlineStar, MdStarOutline, MdStarHalf } from "react-icons/md";

function StarRating({ rating }: { rating: number }) {
  // Round to the nearest half
  const roundedRating = Math.round(rating * 2) / 2;

  // Create an array to hold the star icons
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      // Full star
      stars.push(<MdOutlineStar key={i} />);
    } else if (i === Math.ceil(roundedRating) && roundedRating % 1 !== 0) {
      // Half star
      stars.push(<MdStarHalf key={i} />);
    } else {
      // Empty star
      stars.push(<MdStarOutline key={i} />);
    }
  }

  return <div className="flex">{stars}</div>;
}

export default StarRating;
