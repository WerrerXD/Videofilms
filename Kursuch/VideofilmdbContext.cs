using System;
using System.Collections.Generic;
using Kursuch.Models;
using Microsoft.EntityFrameworkCore;

namespace Kursuch;

public partial class VideofilmdbContext : DbContext
{
    public VideofilmdbContext()
    {
    }

    public VideofilmdbContext(DbContextOptions<VideofilmdbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<CartItem> CartItems { get; set; }

    public virtual DbSet<Genre> Genres { get; set; }

    public virtual DbSet<License> Licenses { get; set; }

    public virtual DbSet<Movie> Movies { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<Studio> Studios { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserLicense> UserLicenses { get; set; }

    public virtual DbSet<Wishlist> Wishlists { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=ConnectionStrings:VideofilmDbContext");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.CartId).HasName("Cart_pkey");

            entity.Property(e => e.CartId)
                .HasDefaultValueSql("nextval('\"Cart_CartID_seq\"'::regclass)")
                .HasColumnName("CartID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.Status).HasDefaultValueSql("'active'::text");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Carts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("UserID");
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.CartItemId).HasName("CartItems_pkey");

            entity.Property(e => e.CartItemId).HasColumnName("CartItemID");
            entity.Property(e => e.CartId).HasColumnName("CartID");
            entity.Property(e => e.LicenseId).HasColumnName("LicenseID");
            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.Quantity).HasDefaultValue(1);

            entity.HasOne(d => d.Cart).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.CartId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("CartID");

            entity.HasOne(d => d.License).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.LicenseId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("LicenseID");

            entity.HasOne(d => d.Movie).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("MovieID");
        });

        modelBuilder.Entity<Genre>(entity =>
        {
            entity.HasKey(e => e.GenreId).HasName("Genres_pkey");

            entity.Property(e => e.GenreId).HasColumnName("GenreID");
        });

        modelBuilder.Entity<License>(entity =>
        {
            entity.HasKey(e => e.LicenseId).HasName("Licenses_pkey");

            entity.Property(e => e.LicenseId).HasColumnName("LicenseID");
            entity.Property(e => e.PriceMultiplier)
                .HasPrecision(4, 2)
                .HasDefaultValueSql("1.00");
        });

        modelBuilder.Entity<Movie>(entity =>
        {
            entity.HasKey(e => e.MovieId).HasName("Movies_pkey");

            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.GenreId).HasColumnName("GenreID");
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.StudioId).HasColumnName("StudioID");

            entity.HasOne(d => d.Genre).WithMany(p => p.Movies)
                .HasForeignKey(d => d.GenreId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("GenreID");

            entity.HasOne(d => d.Studio).WithMany(p => p.Movies)
                .HasForeignKey(d => d.StudioId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("StudioID");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("Orders_pkey");

            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.OrderDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("UserID");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.OrderItemId).HasName("OrderItems_pkey");

            entity.Property(e => e.OrderItemId).HasColumnName("OrderItemID");
            entity.Property(e => e.LicenseId).HasColumnName("LicenseID");
            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.Price).HasPrecision(10, 2);

            entity.HasOne(d => d.License).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.LicenseId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("LicenseID");

            entity.HasOne(d => d.Movie).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("MovieID");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("OrderID");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("Payments_pkey");

            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
            entity.Property(e => e.Amount).HasPrecision(10, 2);
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.PaymentMethodId).HasColumnName("PaymentMethodID");

            entity.HasOne(d => d.Order).WithMany(p => p.Payments)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("OrderID");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PaymentMethodId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("PaymentMethodID");
        });

        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.PaymentMethodId).HasName("PaymentMethods_pkey");

            entity.Property(e => e.PaymentMethodId).HasColumnName("PaymentMethodID");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("Reviews_pkey");

            entity.Property(e => e.ReviewId).HasColumnName("ReviewID");
            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.ReviewDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Movie).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("MovieID");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("UserID");
        });

        modelBuilder.Entity<Studio>(entity =>
        {
            entity.HasKey(e => e.StudioId).HasName("Studios_pkey");

            entity.Property(e => e.StudioId).HasColumnName("StudioID");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("Users_pkey");

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
        });

        modelBuilder.Entity<UserLicense>(entity =>
        {
            entity.HasKey(e => e.UserLicenceId).HasName("UserLicenses_pkey");

            entity.Property(e => e.UserLicenceId).HasColumnName("UserLicenceID");
            entity.Property(e => e.EndDate).HasColumnType("timestamp without time zone");
            entity.Property(e => e.LicenseId).HasColumnName("LicenseID");
            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.StartDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.License).WithMany(p => p.UserLicenses)
                .HasForeignKey(d => d.LicenseId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("LicenseID");

            entity.HasOne(d => d.Movie).WithMany(p => p.UserLicenses)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("MovieID");

            entity.HasOne(d => d.User).WithMany(p => p.UserLicenses)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("UserID");
        });

        modelBuilder.Entity<Wishlist>(entity =>
        {
            entity.HasKey(e => e.WishlistId).HasName("Wishlist_pkey");

            entity.ToTable("Wishlist");

            entity.Property(e => e.WishlistId).HasColumnName("WishlistID");
            entity.Property(e => e.DateAdded)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Movie).WithMany(p => p.Wishlists)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("MovieID");

            entity.HasOne(d => d.User).WithMany(p => p.Wishlists)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("UserID");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
