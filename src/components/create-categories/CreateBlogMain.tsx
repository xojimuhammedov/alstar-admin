"use client";

import moment from "moment/moment";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import Image from "next/image";
import useGlobalContext from "@/hooks/use-context";
import apiUrl from "@/utils/api";
import { useRouter } from "next/navigation";
import Preloader from "@/sheardComponent/Preloader/Preloader";
import CKeditor from "../create-service/CKeditor";

interface FormData {
  name_uz: string;
  description_uz: string;
  name_en: string;
  name_ru: string;
  description_en: string;
  description_ru: string;
  file: string;
}

const CreateServiceMain = () => {
  const router = useRouter();
  const { loading, setLoading } = useGlobalContext();
  const [upload, setupload] = useState<boolean>(false);
  const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
  const [dataOne, setDataOne] = useState<string>("");
  const [dataTwo, setDataTwo] = useState<string>("");
  const [dataThree, setDataThree] = useState<string>("");
  const now = moment();
  const date = now.format("MM/DD/YY hh:mm a");
  const [loginError, setloginError] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const formData = new FormData();
    setLoading(true);

    if (data.file && data.file.length) {
      for (let i = 0; i < data.file.length; i++) {
        formData.append("file", data.file[i]);
      }
    }

    formData.append("name_uz", data.name_uz);
    formData.append("name_ru", data.name_ru);
    formData.append("description_uz", dataOne);
    formData.append("name_en", data.name_en);
    formData.append("description_en", dataTwo);
    formData.append("description_ru", dataThree);

    axios
      .post(`${apiUrl}/projects/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success(`Projects yaratildi!🎉`, {
          position: "top-left",
        });
        reset();
        router.push("/categories");
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 403 || error.response.status === 401) {
          toast.error(`Qaytadan login qiling!`, {
            position: "top-left",
          });
          console.error("Unauthorized access");
        } else {
          console.error("Unauthorized access");
        }
      });
  };

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="cashier-content-area mt-[30px] ml-[300px] px-7">
        <div className="cashier-addsupplier-area bg-white p-7 custom-shadow rounded-lg pt-5 mb-5">
          <h4 className="text-[20px] font-bold text-heading mb-9">
            Projects yaratish
          </h4>
          <div className="grid grid-cols-12 gap-x-5">
            <div className="lg:col-span-4 md:col-span-6 col-span-12">
              <div className="cashier-select-field mb-5">
                <h5 className="text-[15px] text-heading font-semibold mb-3">
                  {" "}
                  Projects nomi (Uzbek)
                </h5>
                <div className="cashier-input-field-style">
                  <div className="single-input-field w-full">
                    <input
                      type="text"
                      placeholder="Projects nomi"
                      {...register("name_uz", {
                        required: "Name (Uzbek) is required",
                      })}
                    />
                    {errors.name_uz && <span>{errors.name_uz.message}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 md:col-span-6 col-span-12">
              <div className="cashier-select-field mb-5">
                <h5 className="text-[15px] text-heading font-semibold mb-3">
                  {" "}
                  Projects nomi (English)
                </h5>
                <div className="cashier-input-field-style">
                  <div className="single-input-field w-full">
                    <input
                      type="text"
                      placeholder="Projects nomi"
                      {...register("name_en", {
                        required: "Name (Uzbek) is required",
                      })}
                    />
                    {errors.name_en && <span>{errors.name_en.message}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 md:col-span-6 col-span-12">
              <div className="cashier-select-field mb-5">
                <h5 className="text-[15px] text-heading font-semibold mb-3">
                  {" "}
                  Projects nomi (Rus)
                </h5>
                <div className="cashier-input-field-style">
                  <div className="single-input-field w-full">
                    <input
                      type="text"
                      placeholder="Projects nomi"
                      {...register("name_ru", {
                        required: "Name (Rus) is required",
                      })}
                    />
                    {errors.name_ru && <span>{errors.name_ru.message}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 md:col-span-6 col-span-12">
              <div className="cashier-select-field mb-5">
                <h5 className="text-[15px] text-heading font-semibold mb-3">
                  {" "}
                  Izoh (Uzbek)
                </h5>
                <div className="cashier-input-field-style">
                  <div className="single-input-field w-full">
                    <CKeditor
                      onChange={(data: string) => {
                        setDataOne(data);
                      }}
                      editorLoaded={editorLoaded}
                    />
                    {errors.description_uz && (
                      <span>{errors.description_uz.message}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 md:col-span-6 col-span-12">
              <div className="cashier-select-field mb-5">
                <h5 className="text-[15px] text-heading font-semibold mb-3">
                  {" "}
                  Izoh (English)
                </h5>
                <div className="cashier-input-field-style">
                  <div className="single-input-field w-full">
                    <CKeditor
                      onChange={(data: string) => {
                        setDataTwo(data);
                      }}
                      editorLoaded={editorLoaded}
                    />
                    {errors.description_en && (
                      <span>{errors.description_en.message}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 md:col-span-6 col-span-12">
              <div className="cashier-select-field mb-5">
                <h5 className="text-[15px] text-heading font-semibold mb-3">
                  {" "}
                  Izoh (Rus)
                </h5>
                <div className="cashier-input-field-style">
                  <div className="single-input-field w-full">
                    <CKeditor
                      onChange={(data: string) => {
                        setDataThree(data);
                      }}
                      editorLoaded={editorLoaded}
                    />
                    {errors.description_ru && (
                      <span>{errors.description_ru.message}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 md:col-span-6 col-span-12">
              <div className="cashier-select-field mb-5">
                <h5 className="text-[15px] text-heading font-semibold mb-3">
                  {" "}
                  Rasm yuklash
                </h5>
                <div className="cashier-input-field-style">
                  <div className="single-input-field w-full">
                    <input
                      type="file"
                      placeholder="Add Product Rating"
                      {...register("file")}
                      style={{ padding: 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12">
              <div className="cashier-managesale-top-btn default-light-theme pt-2.5">
                <button className="btn-primary" type="submit">
                  Yaratish
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateServiceMain;
