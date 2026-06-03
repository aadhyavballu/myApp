import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

export const supabaseUrl =
  "https://vceleermtpmvunihnkes.supabase.co";

export const supabaseAnonKey =
  "sb_publishable_KAtYyaWREmgmFiH9A3pZqA_RUNZEhjL";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );