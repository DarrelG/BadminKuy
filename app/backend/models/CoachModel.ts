import { supabase } from "~/config/supabase";
export class CoachModel {
    id: string = "";
    profileId: string = "";
    name: string = "";
    description: string = "";
    district: string = "";
    pricePerHour: number = 0;
    rating: number = 0;
    isVerified: boolean = false;
    imageUrl: string = "";
    createdAt: string = "";

    static readonly table = "coaches";

    static fromRow(row: any): CoachModel {
        const m = new CoachModel();
        m.id = row.id;
        m.profileId = row.profile_id;
        m.name = row.name;
        m.description = row.description ?? "";
        m.district = row.district ?? "";
        m.pricePerHour = row.price_per_hour;
        m.rating = row.rating;
        m.isVerified = row.is_verified;
        m.imageUrl = row.image_url ?? "";
        m.createdAt = row.created_at;
        return m;
    }

    static async Run(): Promise<CoachModel[]> {
        const { data, error } = await supabase
            .from(CoachModel.table)
            .select("*");

        if (error) throw error;
        return (data ?? []).map(CoachModel.fromRow);
    }
}