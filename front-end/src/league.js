export const getLeague = (rating) => {
    if (rating >= 2200) {
        return 'Grand Master';
    } else if (rating >= 2150) {
        return 'Master';
    } else if (rating >= 2100) {
        return 'Diamond';
    } else if (rating >= 2050) {
        return 'Platinum';
    } else if (rating >= 2000) {
        return 'Gold';
    } else if (rating >= 1950) {
        return 'Silver';
    }
    return 'Bronze';
};