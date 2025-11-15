"""
Authentication endpoints for user signup, login, and profile access.
"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.core.dependencies import get_current_user, get_supabase
from app.db.schemas import UserSignup, UserLogin, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserSignup,
    supabase: Annotated[Client, Depends(get_supabase)]
):
    """
    Register a new user account.

    Args:
        user_data: User email and password
        supabase: Supabase client dependency

    Returns:
        TokenResponse with access token and user data

    Raises:
        HTTPException: If signup fails (e.g., email already exists)
    """
    try:
        # Supabase handles password hashing automatically
        response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password
        })

        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user account"
            )

        # Handle case where email confirmation is required
        if not response.session:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email confirmation required. Please check your Supabase settings to disable email confirmation for development."
            )

        return TokenResponse(
            access_token=response.session.access_token,
            token_type="bearer",
            user={
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at
            }
        )

    except Exception as e:
        # Handle Supabase-specific errors
        error_msg = str(e)
        if "already registered" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Signup failed: {error_msg}"
        )


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    supabase: Annotated[Client, Depends(get_supabase)]
):
    """
    Authenticate user and return access token.

    Args:
        credentials: User email and password
        supabase: Supabase client dependency

    Returns:
        TokenResponse with access token and user data

    Raises:
        HTTPException: If credentials are invalid
    """
    try:
        response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })

        if not response.user or not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        return TokenResponse(
            access_token=response.session.access_token,
            token_type="bearer",
            user={
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: Annotated[dict, Depends(get_current_user)]
):
    """
    Get current authenticated user's profile.

    Args:
        current_user: User data from JWT token dependency

    Returns:
        UserResponse with user profile data
    """
    # Use data from JWT token (Supabase manages auth.users separately)
    return UserResponse(
        id=current_user["user_id"],
        email=current_user.get("email", ""),
        created_at=""  # JWT doesn't include created_at
    )


@router.post("/logout")
async def logout(
    supabase: Annotated[Client, Depends(get_supabase)],
    current_user: Annotated[dict, Depends(get_current_user)]
):
    """
    Logout current user (invalidate session).

    Args:
        supabase: Supabase client dependency
        current_user: Current authenticated user

    Returns:
        Success message
    """
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        # Even if logout fails, return success (client should discard token)
        return {"message": "Logged out"}
