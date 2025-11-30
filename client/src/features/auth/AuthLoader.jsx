import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "./authApi";
import { setUser, clearUser } from "./authSlice";

export default function AuthLoader({ children }) {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetMeQuery();

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user)); // Restore user
    }

    if (error) {
      dispatch(clearUser()); // Not authenticated
    }
  }, [data, error, dispatch]);

  if (isLoading) return null; // Prevent UI flicker

  return children;
}
