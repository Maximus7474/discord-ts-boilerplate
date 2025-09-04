-- CreateTable
CREATE TABLE "fav_food" (
    "discord_id" TEXT NOT NULL PRIMARY KEY,
    "favourite_food" TEXT NOT NULL,
    "custom_choice" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "fav_food_discord_id_key" ON "fav_food"("discord_id");
